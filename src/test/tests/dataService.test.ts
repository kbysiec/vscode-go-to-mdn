import { assert } from "chai";
import DataService from "../../dataService";
import ItemType from "../../enums/itemType";
import QuickPickItem from "../../interfaces/quickPickItem";
import * as mock from "../mocks/dataService.mock";
import Cache from "../../cache";
import Utils from "../../utils";
import Config from "../../config";
import { getUtilsStub, getConfigStub, getCacheStub } from "../util/mockFactory";
import { restoreStubbedMultiple, stubMultiple } from "../util/stubUtils";

describe("DataService", () => {
  let cacheStub: Cache;
  let utilsStub: Utils;
  let configStub: Config;
  let dataService: DataService;
  let dataServiceAny: any;

  beforeEach(() => {
    cacheStub = getCacheStub();
    utilsStub = getUtilsStub();
    configStub = getConfigStub();
    dataService = new DataService(cacheStub, utilsStub, configStub);
    dataServiceAny = dataService as any;
  });

  describe("getFlatQuickPickData", () => {
    it("should return flat quick pick data from cache", async () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.config, method: "shouldDisplayFlatList" },
        { object: dataServiceAny.cache, method: "getFlatData" },
      ]);

      stubMultiple([
        {
          object: dataServiceAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
        {
          object: dataServiceAny.cache,
          method: "getFlatData",
          returns: mock.items,
        },
      ]);

      const actual = await dataServiceAny.getFlatQuickPickData();
      const expected: QuickPickItem[] = [
        {
          label: `$(link) sub-label`,
          url: "#",
          type: ItemType.File,
          parent: undefined,
          rootParent: undefined,
          breadcrumbs: ["api", "test-label", "sub-label"],
          description: "api test-label sub-label",
        },
        {
          label: `$(link) sub-label 2`,
          url: "https://sub-label-2.com",
          type: ItemType.File,
          parent: undefined,
          rootParent: undefined,
          breadcrumbs: ["api", "test-label", "sub-label 2"],
          description: "api test-label sub-label 2",
        },
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return flat quick pick data if in cache is empty array", async () => {
      const qpItems: QuickPickItem[] = [
        {
          label: `$(link) sub-label`,
          url: "#",
          type: ItemType.File,
          parent: undefined,
          rootParent: undefined,
          breadcrumbs: ["api", "test-label", "sub-label"],
          description: "api test-label sub-label",
        },
        {
          label: `$(link) sub-label 2`,
          url: "https://sub-label-2.com",
          type: ItemType.File,
          parent: undefined,
          rootParent: undefined,
          breadcrumbs: ["api", "test-label", "sub-label 2"],
          description: "api test-label sub-label 2",
        },
      ];

      restoreStubbedMultiple([
        { object: dataServiceAny.config, method: "shouldDisplayFlatList" },
        { object: dataServiceAny.cache, method: "getFlatData" },
        { object: dataServiceAny.cache, method: "updateFlatData" },
        {
          object: dataServiceAny.config,
          method: "getGithubPersonalAccessToken",
        },
      ]);

      stubMultiple([
        {
          object: dataServiceAny.cache,
          method: "getFlatData",
          returns: [],
        },
        {
          object: dataServiceAny.dataDownloader,
          method: "downloadFlatData",
          returns: Promise.resolve(mock.items),
        },
        {
          object: dataServiceAny.dataConverter,
          method: "prepareQpData",
          returns: qpItems,
        },
        {
          object: dataServiceAny.cache,
          method: "updateFlatData",
        },
        {
          object: dataServiceAny.config,
          method: "getGithubPersonalAccessToken",
          returns: "sample token",
        },
        {
          object: dataServiceAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
      ]);

      assert.deepEqual(await dataServiceAny.getFlatQuickPickData(), qpItems);
    });

    it("should do nothing in fetching flat quick pick data if shouldDisplayFlatList returns false", async () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.config, method: "shouldDisplayFlatList" },
        { object: dataServiceAny.cache, method: "getFlatData" },
        { object: dataServiceAny.cache, method: "updateFlatData" },
        {
          object: dataServiceAny.config,
          method: "getGithubPersonalAccessToken",
        },
      ]);

      const [cacheFlatFilesWithProgressTaskStub] = stubMultiple([
        {
          object: dataServiceAny,
          method: "cacheFlatFilesWithProgressTask",
        },
        {
          object: dataServiceAny.cache,
          method: "getFlatData",
          returns: undefined,
        },
        {
          object: dataServiceAny.dataDownloader,
          method: "downloadFlatData",
          returns: Promise.resolve(mock.items),
        },
        {
          object: dataServiceAny.cache,
          method: "updateFlatData",
        },
        {
          object: dataServiceAny.config,
          method: "getGithubPersonalAccessToken",
          returns: "sample token",
        },
        {
          object: dataServiceAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
      ]);

      await dataServiceAny.getFlatQuickPickData();

      assert.equal(cacheFlatFilesWithProgressTaskStub.calledOnce, false);
    });
  });

  describe("getQuickPickRootData", () => {
    it("should return tree root data", async () => {
      stubMultiple([
        {
          object: dataServiceAny,
          method: "getTreeData",
          returns: mock.qpItems,
        },
      ]);

      assert.deepEqual(
        await dataServiceAny.getQuickPickRootData(),
        mock.qpItems
      );
    });
  });

  describe("getQuickPickData", () => {
    it("should return higher level data", async () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.utils, method: "getNameFromQuickPickItem" },
      ]);

      stubMultiple([
        {
          object: dataServiceAny.utils,
          method: "getNameFromQuickPickItem",
          returns: "..",
        },
        {
          object: dataServiceAny,
          method: "higherLevelData",
          returns: [mock.qpItems],
          isNotMethod: true,
        },
      ]);

      const backwardNavigationQpItem: QuickPickItem =
        mock.backwardNavigationQpItem;

      assert.deepEqual(
        await dataServiceAny.getQuickPickData(backwardNavigationQpItem),
        mock.qpItems
      );
    });

    it("should return lower level data", async () => {
      stubMultiple([
        {
          object: dataServiceAny,
          method: "getLowerLevelQpData",
          returns: mock.qpItems,
        },
      ]);

      assert.deepEqual(
        await dataServiceAny.getQuickPickData(mock.qpItem),
        mock.qpItems
      );
    });

    it("should return lower level data without empty urls", async () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.utils, method: "removeDataWithEmptyUrl" },
      ]);

      stubMultiple([
        {
          object: dataServiceAny.utils,
          method: "removeDataWithEmptyUrl",
          returns: mock.qpItems,
        },
        {
          object: dataServiceAny,
          method: "getTreeData",
          returns: mock.qpItems,
        },
      ]);

      assert.deepEqual(
        await dataServiceAny.getQuickPickData(mock.qpItem),
        mock.qpItems
      );
    });

    it("should return quick pick tree data if data is not in cache and parent item is provided", async () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.utils, method: "removeDataWithEmptyUrl" },
        { object: dataServiceAny.cache, method: "updateTreeDataByItem" },
        { object: dataServiceAny.cache, method: "getTreeDataByItem" },
      ]);
      stubMultiple([
        {
          object: dataServiceAny.cache,
          method: "getTreeDataByItem",
          returns: [],
        },
        {
          object: dataServiceAny.dataDownloader,
          method: "downloadTreeData",
          returns: Promise.resolve(mock.items),
        },
        {
          object: dataServiceAny.cache,
          method: "updateTreeDataByItem",
        },
        {
          object: dataServiceAny.dataConverter,
          method: "prepareQpData",
          returns: mock.qpItems,
        },
        {
          object: dataServiceAny.utils,
          method: "removeDataWithEmptyUrl",
          returns: mock.qpItems,
        },
      ]);

      assert.deepEqual(
        await dataService.getQuickPickData(mock.qpItem),
        mock.qpItems
      );
    });

    it("should return quick pick tree data if data is in cache", async () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.utils, method: "removeDataWithEmptyUrl" },
        { object: dataServiceAny.cache, method: "getTreeDataByItem" },
      ]);
      stubMultiple([
        {
          object: dataServiceAny.cache,
          method: "getTreeDataByItem",
          returns: mock.items,
        },
        {
          object: dataServiceAny.dataConverter,
          method: "prepareQpData",
          returns: mock.qpItems,
        },
        {
          object: dataServiceAny.utils,
          method: "removeDataWithEmptyUrl",
          returns: mock.qpItems,
        },
      ]);

      assert.deepEqual(
        await dataService.getQuickPickData(mock.qpItem),
        mock.qpItems
      );
    });
  });

  describe("rememberHigherLevelQpData", () => {
    it("should remember higher level data", () => {
      stubMultiple([
        {
          object: dataServiceAny,
          method: "higherLevelData",
          returns: [],
          isNotMethod: true,
        },
      ]);

      dataService.rememberHigherLevelQpData(mock.qpItems);

      assert.deepEqual(dataServiceAny.higherLevelData, [mock.qpItems]);
    });
  });

  describe("isHigherLevelDataEmpty", () => {
    it("should check if higherLevelData array is empty", () => {
      stubMultiple([
        {
          object: dataServiceAny,
          method: "higherLevelData",
          returns: [mock.qpItems],
          isNotMethod: true,
        },
      ]);

      assert.equal(dataServiceAny.isHigherLevelDataEmpty(), false);
    });
  });
});
