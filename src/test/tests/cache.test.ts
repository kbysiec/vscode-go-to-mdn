import * as vscode from 'vscode';
import { assert } from "chai";
import * as sinon from "sinon";
import Cache from '../../cache';
import QuickPickExtendedItem from "../../interfaces/QuickPickExtendedItem";
import Item from "../../interfaces/Item";
import ItemType from "../../enums/ItemType";
import { config } from "../../config";

describe("Cache", function () {
  let cache: Cache;
  let context: vscode.ExtensionContext;
  let updateSpy: any;

  before(function () {
    sinon.stub(config, "filesCacheKey").value("filesCache");
    sinon.stub(config, "cacheKey").value("cache");
    sinon.stub(config, "rootUrl").value("https://api.github.com/repos/mdn/browser-compat-data/contents/README.md?ref=master");

    updateSpy = sinon.spy();

    context = {
      subscriptions: [],
      workspaceState: {
        get: () => { },
        update: () => Promise.resolve(),
      },
      globalState: {
        get: () => { },
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

  after(function () {
    sinon.restore();
  });

  describe("updateFlatFilesListCache", function () {
    it("should function exist", function () {
      const actual = typeof (cache.updateFlatFilesListCache);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should update cache value", function () {

      const data: Item[] = [
        { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] },
        { name: "sub-label 2", url: "https://sub-label-2.com", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label 2"] }
      ];

      let getStub = sinon.stub(context.globalState, "get").returns({});
      const get = context.globalState.get as any;
      const update = context.globalState.update as any;

      cache.updateFlatFilesListCache(data);
      let getCalled = get.called;

      assert.equal(getCalled, true);
      getStub.restore();

      getStub = sinon.stub(context.globalState, "get").returns(undefined);
      cache.updateFlatFilesListCache(data);
      getCalled = get.called;

      const updateCalled = update.calledTwice;

      assert.equal(getCalled, true);
      assert.equal(updateCalled, true);

      getStub.restore();
      updateSpy.resetHistory();
    });
  });

  describe("updateTreeItemsByUrlFromCache", function () {
    it("should function exist", function () {
      const actual = typeof (cache.updateTreeItemsByUrlFromCache);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should update cache value if item is undefined", function () {

      const data: Item[] = [
        { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] },
        { name: "sub-label 2", url: "https://sub-label-2.com", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label 2"] }
      ];

      let getStub = sinon.stub(context.globalState, "get").returns({});
      const get = context.globalState.get as any;
      const update = context.globalState.update as any;

      cache.updateTreeItemsByUrlFromCache(data);
      let getCalled = get.called;

      assert.equal(getCalled, true);
      getStub.restore();

      getStub = sinon.stub(context.globalState, "get").returns(undefined);
      cache.updateTreeItemsByUrlFromCache(data);
      getCalled = get.called;

      const updateCalled = update.calledTwice;

      assert.equal(getCalled, true);
      assert.equal(updateCalled, true);

      getStub.restore();
      updateSpy.resetHistory();
    });

    it("should update cache value if item is passed", function () {

      const data: Item[] = [
        { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] },
        { name: "sub-label 2", url: "https://sub-label-2.com", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label 2"] }
      ];

      const item: Item = { name: "sub-label 3", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label 3"] };

      let getStub = sinon.stub(context.globalState, "get").returns({});
      const get = context.globalState.get as any;
      const update = context.globalState.update as any;

      cache.updateTreeItemsByUrlFromCache(data, item);
      let getCalled = get.called;

      assert.equal(getCalled, true);
      getStub.restore();

      getStub = sinon.stub(context.globalState, "get").returns(undefined);
      cache.updateTreeItemsByUrlFromCache(data, item);
      getCalled = get.called;

      const updateCalled = update.calledTwice;

      assert.equal(getCalled, true);
      assert.equal(updateCalled, true);

      getStub.restore();
      updateSpy.resetHistory();
    });
  });

  describe("getFlatFilesFromCache", function () {
    it("should function exist", function () {
      const actual = typeof (cache.getFlatFilesFromCache);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return value from cache", function () {
      const returnData: Item[] = [
        { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] },
        { name: "sub-label 2", url: "https://sub-label-2.com", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label 2"] }
      ];

      let getStub = sinon.stub(context.globalState, "get").returns({
        "files": returnData
      });

      const expected = cache.getFlatFilesFromCache();

      assert.deepEqual(expected, returnData);

      getStub.restore();
    });

    it("should return empty array from cache", function () {
      const returnData: Item[] = [];

      let getStub = sinon.stub(context.globalState, "get").returns(undefined);
      const expected = cache.getFlatFilesFromCache();

      assert.deepEqual(expected, returnData);

      getStub.restore();
    });
  });

  describe("getTreeItemsByUrlFromCache", function () {
    it("should function exist", function () {
      const actual = typeof (cache.getTreeItemsByUrlFromCache);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return value from cache if item is undefined", function () {
      const returnData: Item[] = [
        { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] },
        { name: "sub-label 2", url: "https://sub-label-2.com", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label 2"] }
      ];

      let getStub = sinon.stub(context.globalState, "get").returns({
        [config.rootUrl]: returnData
      });

      const expected = cache.getTreeItemsByUrlFromCache();

      assert.deepEqual(expected, returnData);

      getStub.restore();
    });

    it("should return value from cache if item is passed", function () {
      const qpItem: QuickPickExtendedItem = { label: "test-label", url: "#", type: ItemType.Directory, breadcrumbs: [] };

      const returnData: Item[] = [
        { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] },
        { name: "sub-label 2", url: "https://sub-label-2.com", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label 2"] }
      ];

      let getStub = sinon.stub(context.globalState, "get").returns({
        [qpItem.url]: returnData
      });

      const expected = cache.getTreeItemsByUrlFromCache(qpItem);

      assert.deepEqual(expected, returnData);

      getStub.restore();
    });

    it("should return empty array from cache if key not found", function () {
      const returnData: Item[] = [];

      let getStub = sinon.stub(context.globalState, "get").returns(undefined);
      const expected = cache.getTreeItemsByUrlFromCache();

      assert.deepEqual(expected, returnData);

      getStub.restore();
    });
  });

  describe("clearCache", function () {
    it("should function exist", function () {
      const actual = typeof (cache.clearCache);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should clear cache", function () {
      const update = context.globalState.update as any;
      cache.clearCache();

      const updateCalled = update.calledTwice;
      assert.equal(updateCalled, true);
      updateSpy.resetHistory();
    });
  });
});
