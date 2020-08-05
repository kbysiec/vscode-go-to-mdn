import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import DataService from "../../dataService";
import Item from "../../interfaces/item";
import ItemType from "../../enums/itemType";
import QuickPickItem from "../../interfaces/quickPickItem";
import * as mock from "../mocks/extensionController.mock";
import Cache from "../../cache";
import Utils from "../../utils";
import Config from "../../config";
import { getUtilsStub, getConfigStub, getCacheStub } from "../util/mockFactory";

describe("DataService", () => {
  let cacheStub: Cache;
  let utilsStub: Utils;
  let configStub: Config;
  let dataService: DataService;
  let dataServiceAny: any;

  before(function () {
    cacheStub = getCacheStub();
    utilsStub = getUtilsStub();
    configStub = getConfigStub();
    dataService = new DataService(cacheStub, utilsStub, configStub);
  });

  beforeEach(function () {
    dataServiceAny = dataService as any;
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("getFlatFilesData", () => {
    it("should invoke downloadFlatFilesData function", async function () {
      const stub = sinon
        .stub(dataServiceAny, "downloadFlatFilesData")
        .returns(Promise.resolve());
      const progress: any = { report: sinon.stub() };

      await dataServiceAny.getFlatFilesData(progress);

      const actual = stub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("cacheFlatFilesWithProgressTask", () => {
    it("should invoke cacheFlatFilesData function", async function () {
      const stub = sinon
        .stub(dataServiceAny, "cacheFlatFilesData")
        .returns(Promise.resolve());
      const progress: any = { report: sinon.stub() };

      await dataServiceAny.cacheFlatFilesWithProgressTask(progress);

      const actual = stub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("cacheFlatFilesWithProgress", () => {
    it("should download and cache data if cache returns undefined", async function () {
      const stub = sinon
        .stub(vscode.window, "withProgress")
        .returns(Promise.resolve());
      sinon.stub(dataServiceAny.config, "shouldDisplayFlatList").returns(true);
      sinon
        .stub(dataServiceAny.config, "getGithubPersonalAccessToken")
        .returns("sample token");
      sinon.stub(dataServiceAny.cache, "getFlatData").returns(undefined);
      sinon
        .stub(dataServiceAny, "cacheFlatFilesData")
        .returns(Promise.resolve());

      await dataServiceAny.cacheFlatFilesWithProgress();

      const actual = stub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should do nothing if data is in cache", async function () {
      const stub = sinon
        .stub(vscode.window, "withProgress")
        .returns(Promise.resolve());
      const items: Item[] = mock.items;
      sinon.stub(dataServiceAny.cache, "getFlatData").returns(items);

      await dataServiceAny.cacheFlatFilesWithProgress();

      const actual = stub.called;
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe("cacheFlatFilesData", () => {
    it("should invoke getFlatFilesData function", async function () {
      const stub = sinon
        .stub(dataServiceAny, "getFlatFilesData")
        .returns(Promise.resolve());
      const progress: any = {};

      await dataServiceAny.cacheFlatFilesData(progress);

      const actual = stub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("isHigherLevelDataEmpty", () => {
    it("should check if higherLevelData array is empty", () => {
      sinon.stub(dataServiceAny, "higherLevelData").value([1]);

      const actual = dataServiceAny.isHigherLevelDataEmpty();
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe("getFlatQuickPickData", () => {
    it("should return flat quick pick data from cache", async function () {
      sinon.stub(dataServiceAny.config, "shouldDisplayFlatList").returns(true);
      const items: Item[] = mock.items;
      sinon.stub(dataServiceAny.cache, "getFlatData").returns(items);

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

    it("should return flat quick pick data if in cache is empty array", async function () {
      sinon.stub(dataServiceAny.config, "shouldDisplayFlatList").returns(true);
      const items: Item[] = mock.items;
      const getFlatDataStub = sinon.stub(dataServiceAny.cache, "getFlatData");
      getFlatDataStub.onFirstCall().returns([]);
      getFlatDataStub.onSecondCall().returns(items);
      sinon
        .stub(dataServiceAny, "cacheFlatFilesWithProgress")
        .returns(Promise.resolve());

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

    it("should return empty array if cache value is undefined", async function () {
      sinon.stub(dataServiceAny.config, "shouldDisplayFlatList").returns(true);
      const getFlatDataStub = sinon.stub(dataServiceAny.cache, "getFlatData");
      getFlatDataStub.returns(undefined);
      sinon
        .stub(dataServiceAny, "cacheFlatFilesWithProgress")
        .returns(Promise.resolve());

      const actual = await dataServiceAny.getFlatQuickPickData();
      const expected: QuickPickItem[] = [];
      assert.deepEqual(actual, expected);
    });
  });

  describe("getQuickPickRootData", () => {
    it("should return tree root data", async function () {
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon
        .stub(dataServiceAny, "getTreeData")
        .returns(Promise.resolve(qpItems));

      const actual = await dataServiceAny.getQuickPickRootData();
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });
  });

  describe("getQuickPickData", () => {
    it("should return higher level data", async function () {
      const backwardNavigationQpItem: QuickPickItem =
        mock.backwardNavigationQpItem;
      const qpItems: QuickPickItem[] = mock.qpItems;
      const higherLevelData: QuickPickItem[][] = [qpItems];
      sinon.stub(dataServiceAny, "higherLevelData").value(higherLevelData);

      const actual = await dataServiceAny.getQuickPickData(
        backwardNavigationQpItem
      );
      const expected: QuickPickItem[] = qpItems;
      assert.deepEqual(actual, expected);
    });

    it("should return lower level data", async function () {
      const qpItem: QuickPickItem = mock.qpItem;
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon
        .stub(dataServiceAny, "getLowerLevelQpData")
        .returns(Promise.resolve(qpItems));

      const actual = await dataServiceAny.getQuickPickData(qpItem);
      const expected: QuickPickItem[] = qpItems;
      assert.deepEqual(actual, expected);
    });
  });

  describe("rememberHigherLevelQpData", () => {
    it("should remember higher level data", () => {
      const qpItems: QuickPickItem[] = mock.qpItems;
      const higherLevelData: QuickPickItem[][] = [];
      sinon.stub(dataServiceAny, "higherLevelData").value(higherLevelData);

      dataService.rememberHigherLevelQpData(qpItems);

      const actual = dataServiceAny.higherLevelData;
      const expected: QuickPickItem[][] = [qpItems];
      assert.deepEqual(actual, expected);
    });
  });

  describe("getHigherLevelQpData", () => {
    it("should return higher level data", () => {
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon.stub(dataServiceAny, "higherLevelData").value([qpItems]);

      const actual = dataServiceAny.getHigherLevelQpData();
      const expected: QuickPickItem[] = qpItems;
      assert.deepEqual(actual, expected);
    });
  });

  describe("getLowerLevelQpData", () => {
    it("should return lower level data without empty urls", async function () {
      const qpItem: QuickPickItem = mock.qpItem;
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon
        .stub(dataServiceAny, "getTreeData")
        .returns(Promise.resolve(qpItems));

      const actual = await dataServiceAny.getLowerLevelQpData(qpItem);
      const expectedSecondItem: QuickPickItem = {
        label: `$(link) sub-label 2`,
        url: "https://sub-label-2.com",
        type: ItemType.File,
        parent: undefined,
        rootParent: undefined,
        breadcrumbs: ["api", "test-label", "sub-label 2"],
        description: "api test-label sub-label 2",
      };
      assert.deepEqual(actual[1], expectedSecondItem);
    });
  });

  describe("getTreeData", () => {
    it("should return quick pick tree data if data is in cache", async function () {
      const items: Item[] = mock.items;
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon.stub(dataServiceAny.cache, "getTreeDataByItem").returns(items);
      sinon
        .stub(dataServiceAny.dataConverter, "prepareQpData")
        .returns(qpItems);

      const actual = await dataServiceAny.getTreeData();
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });

    it("should return quick pick tree data if data is not in cache and parent item is not provided", async function () {
      const items: Item[] = mock.items;
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon.stub(dataServiceAny.cache, "getTreeDataByItem").returns([]);
      sinon.stub(dataServiceAny, "downloadTreeData").returns(items);
      sinon
        .stub(dataServiceAny.dataConverter, "prepareQpData")
        .returns(qpItems);

      const actual = await dataServiceAny.getTreeData();
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });

    it("should return quick pick tree data if data is not in cache and parent item is provided", async function () {
      const items: Item[] = mock.items;
      const qpItems: QuickPickItem[] = mock.qpItems;
      const qpItem: QuickPickItem = mock.qpItem;
      sinon.stub(dataServiceAny.cache, "getTreeDataByItem").returns([]);
      sinon.stub(dataServiceAny, "downloadTreeData").returns(items);
      sinon
        .stub(dataServiceAny.dataConverter, "prepareQpData")
        .returns(qpItems);

      const actual = await dataServiceAny.getTreeData(qpItem);
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });
  });

  describe("downloadTreeData", () => {
    it("should return tree node data", async function () {
      const items: Item[] = mock.items;
      sinon
        .stub(dataServiceAny.dataDownloader, "downloadTreeData")
        .returns(Promise.resolve(items));
      const updateCacheStub = sinon.stub(
        dataServiceAny.cache,
        "updateTreeDataByItem"
      );

      const actualData = await dataServiceAny.downloadTreeData();
      const expectedData = items;
      const actualUpdateCacheCalled = updateCacheStub.calledOnce;
      const expectedUpdateCacheCalled = true;
      assert.equal(actualData, expectedData);
      assert.equal(actualUpdateCacheCalled, expectedUpdateCacheCalled);
    });
  });

  describe("downloadFlatFilesData", () => {
    it("should return flat data", async function () {
      const items: Item[] = mock.items;
      sinon
        .stub(dataServiceAny.dataDownloader, "downloadFlatData")
        .returns(Promise.resolve(items));
      const updateCacheStub = sinon.stub(
        dataServiceAny.cache,
        "updateFlatData"
      );

      const actualData = await dataServiceAny.downloadFlatFilesData();
      const expectedData = items;
      const actualUpdateCacheCalled = updateCacheStub.calledOnce;
      const expectedUpdateCacheCalled = true;
      assert.equal(actualData, expectedData);
      assert.equal(actualUpdateCacheCalled, expectedUpdateCacheCalled);
    });
  });
});
