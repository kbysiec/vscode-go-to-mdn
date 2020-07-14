import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import ExtensionController from "../../ExtensionController";
import Item from "../../interfaces/item";
import ItemType from "../../enums/itemType";
import QuickPickExtendedItem from "../../interfaces/quickPickExtendedItem";
import * as utils from "../../utils";
import { appConfig } from "../../appConfig";
import * as mock from "../mocks/extensionController.mock";

const open = require("open");
const proxyquire = require("proxyquire");

describe("extensionController", function () {
  let context: vscode.ExtensionContext;
  let extensionController: ExtensionController;
  let extensionControllerAny: any;

  before(function () {
    context = {
      subscriptions: [],
      workspaceState: {
        get: () => {},
        update: () => Promise.resolve(),
      },
      globalState: {
        get: () => {},
        update: () => Promise.resolve(),
      },
      extensionPath: "",
      storagePath: "",
      globalStoragePath: "",
      logPath: "",
      asAbsolutePath: (relativePath: string) => relativePath,
    };
    extensionController = new ExtensionController(context);
  });

  beforeEach(function () {
    extensionControllerAny = extensionController as any;
  });

  afterEach(function () {
    sinon.restore();
  });
  describe("showQuickPick", function () {
    it("should function exist", function () {
      const actual = typeof extensionController.showQuickPick;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should load data and show quickPick", async function () {
      const showStub = sinon.stub(extensionControllerAny.quickPick, "show");
      const loadQuickPickDataStub = sinon.stub(
        extensionControllerAny,
        "loadQuickPickData"
      );

      await extensionControllerAny.showQuickPick();
      assert.equal(showStub.calledOnce, true);
      assert.equal(loadQuickPickDataStub.calledOnce, true);
    });
  });

  describe("clearCache", function () {
    it("should function exist", function () {
      const actual = typeof extensionController.clearCache;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should invoke cache clearing function on cache object", async function () {
      const stub = sinon.stub(extensionControllerAny.cache, "clearCache");

      await extensionControllerAny.clearCache();
      assert.equal(stub.calledOnce, true);
    });
  });

  describe("onQuickPickSubmit", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.onQuickPickSubmit;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should invoke openInBrowser function with search url if value is string", async function () {
      const openInBrowserStub = sinon
        .stub(extensionControllerAny, "openInBrowser")
        .returns(Promise.resolve());
      sinon
        .stub(appConfig, "searchUrl")
        .value("https://developer.mozilla.org/search");
      const text = "test search text";

      await extensionControllerAny.onQuickPickSubmit(text);

      const actual = openInBrowserStub.withArgs(
        "https://developer.mozilla.org/search?q=test+search+text"
      ).calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should do nothing if value is string but higherLevelData array is not empty", async function () {
      const openInBrowserStub = sinon
        .stub(extensionControllerAny, "openInBrowser")
        .returns(Promise.resolve());
      sinon
        .stub(appConfig, "searchUrl")
        .value("https://developer.mozilla.org/search");
      sinon.stub(extensionControllerAny, "higherLevelData").value([1]);
      const text = "test search text";

      await extensionControllerAny.onQuickPickSubmit(text);
      const actual = openInBrowserStub.calledOnce;
      const expected = false;
      assert.equal(actual, expected);
    });

    it("should invoke openInBrowser function with item url if value is QuickPickExtendedItem with ItemType.File", async function () {
      const openInBrowserStub = sinon
        .stub(extensionControllerAny, "openInBrowser")
        .returns(Promise.resolve());
      const qpItem: QuickPickExtendedItem = mock.qpItem;

      await extensionControllerAny.onQuickPickSubmit(qpItem);
      const actual = openInBrowserStub.withArgs("http://test.com").calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should invoke loadQuickPickData function with item url if value is QuickPickExtendedItem with ItemType.Directory", async function () {
      const loadQuickPickDataStub = sinon
        .stub(extensionControllerAny, "loadQuickPickData")
        .returns(Promise.resolve());
      const qpItem: QuickPickExtendedItem = mock.qpItemDirectoryType;

      await extensionControllerAny.onQuickPickSubmit(qpItem);

      const actual = loadQuickPickDataStub.withArgs(qpItem).calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should catch error and invoke vscode.window.showErrorMessage", async function () {
      const showErrorMessageStub = sinon.stub(
        vscode.window,
        "showErrorMessage"
      );
      sinon.stub(utils, "getSearchUrl").throws("test error message");

      await extensionControllerAny.onQuickPickSubmit("test search text");

      const actual = showErrorMessageStub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("getFlatFilesData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.getFlatFilesData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should invoke downloadFlatFilesData function", async function () {
      const stub = sinon
        .stub(extensionControllerAny, "downloadFlatFilesData")
        .returns(Promise.resolve());
      const progress: any = { report: sinon.stub() };

      await extensionControllerAny.getFlatFilesData(progress);

      const actual = stub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("cacheFlatFilesWithProgressTask", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.cacheFlatFilesWithProgressTask;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should invoke cacheFlatFilesData function", async function () {
      const stub = sinon
        .stub(extensionControllerAny, "cacheFlatFilesData")
        .returns(Promise.resolve());
      const progress: any = { report: sinon.stub() };

      await extensionControllerAny.cacheFlatFilesWithProgressTask(progress);

      const actual = stub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("cacheFlatFilesWithProgress", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.cacheFlatFilesWithProgress;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should download and cache data if cache returns undefined", async function () {
      const stub = sinon
        .stub(vscode.window, "withProgress")
        .returns(Promise.resolve());
      sinon.stub(utils, "shouldDisplayFlatList").returns(true);
      sinon.stub(utils, "getToken").returns("sample token");
      sinon
        .stub(extensionControllerAny.cache, "getFlatData")
        .returns(undefined);
      sinon
        .stub(extensionControllerAny, "cacheFlatFilesData")
        .returns(Promise.resolve());

      await extensionControllerAny.cacheFlatFilesWithProgress();

      const actual = stub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should do nothing if data is in cache", async function () {
      const stub = sinon
        .stub(vscode.window, "withProgress")
        .returns(Promise.resolve());
      const items: Item[] = mock.items;
      sinon.stub(extensionControllerAny.cache, "getFlatData").returns(items);

      await extensionControllerAny.cacheFlatFilesWithProgress();

      const actual = stub.called;
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe("cacheFlatFilesData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.cacheFlatFilesData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should invoke getFlatFilesData function", async function () {
      const stub = sinon
        .stub(extensionControllerAny, "getFlatFilesData")
        .returns(Promise.resolve());
      const progress: any = {};

      await extensionControllerAny.cacheFlatFilesData(progress);

      const actual = stub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("isHigherLevelDataEmpty", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.isHigherLevelDataEmpty;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should check if higherLevelData array is empty", function () {
      sinon.stub(extensionControllerAny, "higherLevelData").value([1]);

      const actual = extensionControllerAny.isHigherLevelDataEmpty();
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe("loadQuickPickData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.loadQuickPickData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should load flat list of items", async function () {
      sinon.stub(utils, "shouldDisplayFlatList").returns(true);
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      sinon
        .stub(extensionControllerAny, "getFlatQuickPickData")
        .returns(Promise.resolve(qpItems));

      await extensionControllerAny.loadQuickPickData();

      const actual = extensionControllerAny.quickPick.quickPick.items;
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });

    it("should load list of items", async function () {
      sinon.stub(utils, "shouldDisplayFlatList").returns(false);
      const qpItem: QuickPickExtendedItem = mock.qpItemDirectoryType;
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      sinon
        .stub(extensionControllerAny, "getQuickPickData")
        .returns(Promise.resolve(qpItems));

      await extensionControllerAny.loadQuickPickData(qpItem);

      const actual = extensionControllerAny.quickPick.quickPick.items;
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });

    it("should load list of root items", async function () {
      sinon.stub(utils, "shouldDisplayFlatList").returns(false);
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      sinon
        .stub(extensionControllerAny, "getQuickPickRootData")
        .returns(Promise.resolve(qpItems));

      await extensionControllerAny.loadQuickPickData();

      const actual = extensionControllerAny.quickPick.quickPick.items;
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });
  });

  describe("prepareQuickPickPlaceholder", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.prepareQuickPickPlaceholder;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should invoke clearQuickPickPlaceholder if higherLevelData is not empty", function () {
      sinon.stub(extensionControllerAny, "higherLevelData").value([1]);
      const spy = sinon.stub(
        extensionControllerAny,
        "clearQuickPickPlaceholder"
      );

      extensionControllerAny.prepareQuickPickPlaceholder();

      const actual = spy.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should invoke setQuickPickPlaceholder if higherLevelData is empty", function () {
      sinon.stub(extensionControllerAny, "higherLevelData").value([]);
      const spy = sinon.stub(extensionControllerAny, "setQuickPickPlaceholder");

      extensionControllerAny.prepareQuickPickPlaceholder();

      const actual = spy.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("getFlatQuickPickData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.getFlatQuickPickData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return flat quick pick data from cache", async function () {
      sinon.stub(utils, "shouldDisplayFlatList").returns(true);
      const items: Item[] = mock.items;
      sinon.stub(extensionControllerAny.cache, "getFlatData").returns(items);

      const actual = await extensionControllerAny.getFlatQuickPickData();
      const expected: QuickPickExtendedItem[] = [
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
      sinon.stub(utils, "shouldDisplayFlatList").returns(true);
      const items: Item[] = mock.items;
      const getFlatDataStub = sinon.stub(
        extensionControllerAny.cache,
        "getFlatData"
      );
      getFlatDataStub.onFirstCall().returns([]);
      getFlatDataStub.onSecondCall().returns(items);
      sinon
        .stub(extensionControllerAny, "cacheFlatFilesWithProgress")
        .returns(Promise.resolve());

      const actual = await extensionControllerAny.getFlatQuickPickData();
      const expected: QuickPickExtendedItem[] = [
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
      sinon.stub(utils, "shouldDisplayFlatList").returns(true);
      const getFlatDataStub = sinon.stub(
        extensionControllerAny.cache,
        "getFlatData"
      );
      getFlatDataStub.returns(undefined);
      sinon
        .stub(extensionControllerAny, "cacheFlatFilesWithProgress")
        .returns(Promise.resolve());

      const actual = await extensionControllerAny.getFlatQuickPickData();
      const expected: QuickPickExtendedItem[] = [];
      assert.deepEqual(actual, expected);
    });
  });

  describe("getQuickPickRootData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.getQuickPickRootData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return tree root data", async function () {
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      sinon
        .stub(extensionControllerAny, "getTreeData")
        .returns(Promise.resolve(qpItems));

      const actual = await extensionControllerAny.getQuickPickRootData();
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });
  });

  describe("getQuickPickData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.getQuickPickData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return higher level data", async function () {
      const backwardNavigationQpItem: QuickPickExtendedItem =
        mock.backwardNavigationQpItem;
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      const higherLevelData: QuickPickExtendedItem[][] = [qpItems];
      sinon
        .stub(extensionControllerAny, "higherLevelData")
        .value(higherLevelData);

      const actual = await extensionControllerAny.getQuickPickData(
        backwardNavigationQpItem
      );
      const expected: QuickPickExtendedItem[] = qpItems;
      assert.deepEqual(actual, expected);
    });

    it("should return lower level data", async function () {
      const qpItem: QuickPickExtendedItem = mock.qpItem;
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      sinon
        .stub(extensionControllerAny, "getLowerLevelQpData")
        .returns(Promise.resolve(qpItems));

      const actual = await extensionControllerAny.getQuickPickData(qpItem);
      const expected: QuickPickExtendedItem[] = qpItems;
      assert.deepEqual(actual, expected);
    });
  });

  describe("rememberHigherLevelQpData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.rememberHigherLevelQpData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should remember higher level data", function () {
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      const higherLevelData: QuickPickExtendedItem[][] = [];
      sinon
        .stub(extensionControllerAny, "higherLevelData")
        .value(higherLevelData);
      sinon.stub(extensionControllerAny.quickPick, "getItems").returns(qpItems);

      extensionControllerAny.rememberHigherLevelQpData();

      const actual = higherLevelData;
      const expected: QuickPickExtendedItem[][] = [qpItems];
      assert.deepEqual(actual, expected);
    });
  });

  describe("getHigherLevelQpData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.getHigherLevelQpData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return higher level data", function () {
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      sinon.stub(extensionControllerAny, "higherLevelData").value([qpItems]);

      const actual = extensionControllerAny.getHigherLevelQpData();
      const expected: QuickPickExtendedItem[] = qpItems;
      assert.deepEqual(actual, expected);
    });
  });

  describe("getLowerLevelQpData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.getLowerLevelQpData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return lower level data without empty urls", async function () {
      const qpItem: QuickPickExtendedItem = mock.qpItem;
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      sinon
        .stub(extensionControllerAny, "getTreeData")
        .returns(Promise.resolve(qpItems));

      const actual = await extensionControllerAny.getLowerLevelQpData(qpItem);
      const expectedSecondItem: QuickPickExtendedItem = {
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

  describe("setQuickPickPlaceholder", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.setQuickPickPlaceholder;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should invoke quickPick.setPlaceholder function", async function () {
      const spy = sinon.stub(
        extensionControllerAny.quickPick,
        "setPlaceholder"
      );
      const text = "choose item from the list or type anything to search";

      extensionControllerAny.setQuickPickPlaceholder();

      const actual = spy.withArgs(text).calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("clearQuickPickPlaceholder", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.clearQuickPickPlaceholder;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should invoke quickPick.setPlaceholder function with undefined parameter", async function () {
      const stub = sinon.stub(
        extensionControllerAny.quickPick,
        "setPlaceholder"
      );

      extensionControllerAny.clearQuickPickPlaceholder();

      const actual = stub.withArgs(undefined).calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("getTreeData", function () {
    // let items: Item[];
    // let qpItems: QuickPickExtendedItem[];

    // before(function() {
    //   items = [
    //     {
    //       name: "sub-label",
    //       url: "#",
    //       type: ItemType.File,
    //       breadcrumbs: ["api", "test-label", "sub-label"]
    //     },
    //     {
    //       name: "sub-label 2",
    //       url: "https://sub-label-2.com",
    //       type: ItemType.Directory,
    //       breadcrumbs: ["api", "test-label", "sub-label 2"]
    //     }
    //   ];

    //   qpItems = [
    //     {
    //       label: `$(file-directory) sub-label`,
    //       url: "",
    //       type: ItemType.File,
    //       parent: undefined,
    //       rootParent: undefined,
    //       breadcrumbs: ["api", "test-label", "sub-label"],
    //       description: "api test-label sub-label"
    //     },
    //     {
    //       label: `$(file-directory) sub-label 2`,
    //       url: "https://sub-label-2.com",
    //       type: ItemType.Directory,
    //       parent: undefined,
    //       rootParent: undefined,
    //       breadcrumbs: ["api", "test-label", "sub-label 2"],
    //       description: "api test-label sub-label 2"
    //     }
    //   ];
    // });

    it("should function exist", function () {
      const actual = typeof extensionControllerAny.getTreeData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return quick pick tree data if data is in cache", async function () {
      const items: Item[] = mock.items;
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      sinon
        .stub(extensionControllerAny.cache, "getTreeDataByItem")
        .returns(items);
      sinon.stub(utils, "prepareQpData").returns(qpItems);

      const actual = await extensionControllerAny.getTreeData();
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });

    it("should return quick pick tree data if data is not in cache and parent item is not provided", async function () {
      const items: Item[] = mock.items;
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      sinon.stub(extensionControllerAny.cache, "getTreeDataByItem").returns([]);
      sinon.stub(extensionControllerAny, "downloadTreeData").returns(items);
      sinon.stub(utils, "prepareQpData").returns(qpItems);

      const actual = await extensionControllerAny.getTreeData();
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });

    it("should return quick pick tree data if data is not in cache and parent item is provided", async function () {
      const items: Item[] = mock.items;
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      const qpItem: QuickPickExtendedItem = mock.qpItem;
      sinon.stub(extensionControllerAny.cache, "getTreeDataByItem").returns([]);
      sinon.stub(extensionControllerAny, "downloadTreeData").returns(items);
      sinon.stub(utils, "prepareQpData").returns(qpItems);

      const actual = await extensionControllerAny.getTreeData(qpItem);
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });
  });

  describe("downloadTreeData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.downloadTreeData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return tree node data", async function () {
      const items: Item[] = mock.items;
      sinon
        .stub(extensionControllerAny.dataService, "downloadTreeData")
        .returns(Promise.resolve(items));
      const updateCacheStub = sinon.stub(
        extensionControllerAny.cache,
        "updateTreeDataByItem"
      );

      const actualData = await extensionControllerAny.downloadTreeData();
      const expectedData = items;
      const actualUpdateCacheCalled = updateCacheStub.calledOnce;
      const expectedUpdateCacheCalled = true;
      assert.equal(actualData, expectedData);
      assert.equal(actualUpdateCacheCalled, expectedUpdateCacheCalled);
    });
  });

  describe("downloadFlatFilesData", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.downloadFlatFilesData;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return flat data", async function () {
      const items: Item[] = mock.items;
      sinon
        .stub(extensionControllerAny.dataService, "downloadFlatData")
        .returns(Promise.resolve(items));
      const updateCacheStub = sinon.stub(
        extensionControllerAny.cache,
        "updateFlatData"
      );

      const actualData = await extensionControllerAny.downloadFlatFilesData();
      const expectedData = items;
      const actualUpdateCacheCalled = updateCacheStub.calledOnce;
      const expectedUpdateCacheCalled = true;
      assert.equal(actualData, expectedData);
      assert.equal(actualUpdateCacheCalled, expectedUpdateCacheCalled);
    });
  });

  describe("openInBrowser", function () {
    it("should function exist", function () {
      const actual = typeof extensionControllerAny.openInBrowser;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should invoke open function", async function () {
      const openStub = sinon.stub().returns(Promise.resolve());
      const ProxiedExtensionController = proxyquire(
        "../../ExtensionController",
        {
          open: openStub,
        }
      ).default;
      extensionControllerAny = new ProxiedExtensionController(context);

      await extensionControllerAny.openInBrowser("http://test.com");

      const actual = openStub.withArgs("http://test.com").calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });
});
