import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import Cache from "../../cache";
import QuickPickItem from "../../interfaces/QuickPickItem";
import Item from "../../interfaces/Item";
import ItemType from "../../enums/ItemType";
import { appConfig } from "../../appConfig";
import * as mock from "../mocks/cache.mock";

describe("Cache", () => {
  let cache: Cache;
  let context: vscode.ExtensionContext;
  let updateSpy: any;

  before(function () {
    sinon.stub(appConfig, "flatCacheKey").value("flatData");
    sinon.stub(appConfig, "treeCacheKey").value("treeData");
    sinon
      .stub(appConfig, "rootUrl")
      .value(
        "https://api.github.com/repos/mdn/browser-compat-data/contents/README.md?ref=master"
      );

    updateSpy = sinon.spy();

    context = {
      subscriptions: [],
      workspaceState: {
        get: () => {},
        update: () => Promise.resolve(),
      },
      globalState: {
        get: () => {},
        update: updateSpy,
      },
      extensionPath: "",
      storagePath: "",
      globalStoragePath: "",
      logPath: "",
      asAbsolutePath: (relativePath: string) => relativePath,
    };

    cache = new Cache(context);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("updateFlatData", () => {
    it("should update cache value", () => {
      let getStub = sinon.stub(context.globalState, "get").returns({});
      const items: Item[] = mock.items;
      const get = context.globalState.get as any;
      const update = context.globalState.update as any;

      cache.updateFlatData(items);
      let getCalled = get.called;

      assert.equal(getCalled, true);
      getStub.restore();

      getStub = sinon.stub(context.globalState, "get").returns(undefined);
      cache.updateFlatData(items);
      getCalled = get.called;

      const updateCalled = update.calledTwice;

      assert.equal(getCalled, true);
      assert.equal(updateCalled, true);

      getStub.restore();
      updateSpy.resetHistory();
    });
  });

  describe("updateTreeDataByItem", () => {
    it("should update cache value if item is undefined", () => {
      const items: Item[] = mock.items;

      let getStub = sinon.stub(context.globalState, "get").returns({});
      const get = context.globalState.get as any;
      const update = context.globalState.update as any;

      cache.updateTreeDataByItem(items);
      let getCalled = get.called;

      assert.equal(getCalled, true);
      getStub.restore();

      getStub = sinon.stub(context.globalState, "get").returns(undefined);
      cache.updateTreeDataByItem(items);
      getCalled = get.called;

      const updateCalled = update.calledTwice;

      assert.equal(getCalled, true);
      assert.equal(updateCalled, true);

      getStub.restore();
      updateSpy.resetHistory();
    });

    it("should update cache value if item is passed", () => {
      const items: Item[] = mock.items;
      const item: Item = mock.item;

      let getStub = sinon.stub(context.globalState, "get").returns({});
      const get = context.globalState.get as any;
      const update = context.globalState.update as any;

      cache.updateTreeDataByItem(items, item);
      let getCalled = get.called;

      assert.equal(getCalled, true);
      getStub.restore();

      getStub = sinon.stub(context.globalState, "get").returns(undefined);
      cache.updateTreeDataByItem(items, item);
      getCalled = get.called;

      const updateCalled = update.calledTwice;

      assert.equal(getCalled, true);
      assert.equal(updateCalled, true);

      getStub.restore();
      updateSpy.resetHistory();
    });
  });

  describe("getFlatData", () => {
    it("should return value from cache", () => {
      const items: Item[] = mock.items;
      let getStub = sinon.stub(context.globalState, "get").returns(items);

      const expected = cache.getFlatData();
      assert.deepEqual(expected, items);
      getStub.restore();
    });

    it("should return empty array from cache", () => {
      const items: Item[] = [];
      let getStub = sinon.stub(context.globalState, "get").returns(undefined);

      const expected = cache.getFlatData();
      assert.deepEqual(expected, items);
      getStub.restore();
    });
  });

  describe("getTreeDataByItem", () => {
    it("should return value from cache if item is undefined", () => {
      const items: Item[] = mock.items;
      let getStub = sinon.stub(context.globalState, "get").returns({
        [appConfig.rootUrl]: items,
      });

      const expected = cache.getTreeDataByItem();
      assert.deepEqual(expected, items);
      getStub.restore();
    });

    it("should return value from cache if item is passed", () => {
      const qpItem: QuickPickItem = mock.qpItem;
      const items: Item[] = mock.items;
      let getStub = sinon.stub(context.globalState, "get").returns({
        [qpItem.url]: items,
      });

      const expected = cache.getTreeDataByItem(qpItem);
      assert.deepEqual(expected, items);
      getStub.restore();
    });

    it("should return empty array from cache if key not found", () => {
      const items: Item[] = [];
      let getStub = sinon.stub(context.globalState, "get").returns(undefined);

      const expected = cache.getTreeDataByItem();
      assert.deepEqual(expected, items);
      getStub.restore();
    });
  });

  describe("clearCache", () => {
    it("should clear cache", () => {
      const update = context.globalState.update as any;
      cache.clearCache();

      const updateCalled = update.calledTwice;
      assert.equal(updateCalled, true);
      updateSpy.resetHistory();
    });
  });
});
