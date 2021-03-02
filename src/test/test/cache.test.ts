import * as vscode from "vscode";
import * as sinon from "sinon";
import { assert } from "chai";
import Cache from "../../cache";
import { appConfig } from "../../appConfig";
import * as mock from "../mock/cache.mock";
import { getExtensionContext } from "../util/mockFactory";
import { stubMultiple } from "../util/stubUtils";

describe("Cache", () => {
  let cache: Cache;
  let context: vscode.ExtensionContext;
  let updateStub: sinon.SinonStub;

  beforeEach(() => {
    stubMultiple([
      {
        object: appConfig,
        method: "flatCacheKey",
        returns: "flatData",
        isNotMethod: true,
      },
      {
        object: appConfig,
        method: "treeCacheKey",
        returns: "treeData",
        isNotMethod: true,
      },
      {
        object: appConfig,
        method: "rootUrl",
        returns:
          "https://api.github.com/repos/mdn/browser-compat-data/contents/README.md?ref=master",
        isNotMethod: true,
      },
    ]);

    context = getExtensionContext();
    updateStub = sinon.stub();
    context.globalState.update = updateStub;

    cache = new Cache(context);
  });

  describe("updateFlatData", () => {
    it("should update cache value", () => {
      cache.updateFlatData(mock.items);

      assert.equal(
        updateStub.calledWith(appConfig.flatCacheKey, mock.items),
        true
      );
    });
  });

  describe("updateTreeDataByItem", () => {
    it("should update cache value if item is undefined", () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: undefined,
        },
      ]);

      cache.updateTreeDataByItem(mock.items);

      assert.equal(
        updateStub.calledWith(appConfig.treeCacheKey, {
          [appConfig.rootUrl]: mock.items,
        }),
        true
      );
    });

    it("should update cache value if item is passed", () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: {},
        },
      ]);

      cache.updateTreeDataByItem(mock.items, mock.item);

      assert.equal(
        updateStub.calledWith(appConfig.treeCacheKey, {
          [mock.item.url]: mock.items,
        }),
        true
      );
    });
  });

  describe("getFlatData", () => {
    it("should return value from cache", () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: mock.items,
        },
      ]);

      assert.deepEqual(cache.getFlatData(), mock.items);
    });

    it("should return empty array from cache", () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: undefined,
        },
      ]);

      assert.deepEqual(cache.getFlatData(), []);
    });
  });

  describe("getTreeDataByItem", () => {
    it("should return value from cache if item is undefined", () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: {
            [appConfig.rootUrl]: mock.items,
          },
        },
      ]);

      assert.deepEqual(cache.getTreeDataByItem(), mock.items);
    });

    it("should return value from cache if item is passed", () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: {
            [mock.qpItem.url]: mock.items,
          },
        },
      ]);

      assert.deepEqual(cache.getTreeDataByItem(mock.qpItem), mock.items);
    });

    it("should return empty array from cache if key not found", () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: undefined,
        },
      ]);

      assert.deepEqual(cache.getTreeDataByItem(), []);
    });
  });

  describe("clearCache", () => {
    it("should clear cache", () => {
      cache.clearCache();

      assert.equal(updateStub.calledTwice, true);
    });
  });
});
