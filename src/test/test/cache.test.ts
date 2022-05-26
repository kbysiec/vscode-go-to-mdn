import { assert } from "chai";
import * as sinon from "sinon";
import * as vscode from "vscode";
import { appConfig } from "../../appConfig";
import * as cache from "../../cache";
import * as mock from "../mock/cache.mock";
import { getTestSetups } from "../testSetup/cache.testSetup";
import { getExtensionContext } from "../util/mockFactory";

describe("Cache", () => {
  let context: vscode.ExtensionContext = getExtensionContext();
  let updateStub: sinon.SinonStub;
  let setups = getTestSetups(context);

  beforeEach(() => {
    context = getExtensionContext();
    cache.initCache(context);
    setups = getTestSetups(context);
    updateStub = setups.beforeEach();
  });

  describe("updateFlatData", () => {
    it("1: should update cache value", () => {
      cache.updateFlatData(mock.items);

      assert.equal(
        updateStub.calledWith(appConfig.flatCacheKey, mock.items),
        true
      );
    });
  });

  describe("updateTreeDataByItem", () => {
    it("1: should update cache value if item is undefined", () => {
      setups.updateTreeDataByItem1();
      cache.updateTreeDataByItem(mock.items);

      assert.equal(
        updateStub.calledWith(appConfig.treeCacheKey, {
          [appConfig.rootUrl]: mock.items,
        }),
        true
      );
    });

    it("2: should update cache value if item is passed", () => {
      setups.updateTreeDataByItem2();
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
    it("1: should return value from cache", () => {
      setups.getFlatData1();
      assert.deepEqual(cache.getFlatData(), mock.items);
    });

    it("2: should return empty array from cache", () => {
      setups.getFlatData2();
      assert.deepEqual(cache.getFlatData(), []);
    });
  });

  describe("getTreeDataByItem", () => {
    it("1: should return value from cache if item is undefined", () => {
      setups.getTreeDataByItem1();
      assert.deepEqual(cache.getTreeDataByItem(), mock.items);
    });

    it("2: should return value from cache if item is passed", () => {
      setups.getTreeDataByItem2();
      assert.deepEqual(cache.getTreeDataByItem(mock.qpItem), mock.items);
    });

    it("3: should return empty array from cache if key not found", () => {
      setups.getTreeDataByItem3();
      assert.deepEqual(cache.getTreeDataByItem(), []);
    });
  });

  describe("clearCache", () => {
    it("1: should clear cache", () => {
      cache.clearCache();
      assert.equal(updateStub.calledTwice, true);
    });
  });
});
