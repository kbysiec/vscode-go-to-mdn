import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import ExtensionController from "../../ExtensionController";
import QuickPickItem from "../../interfaces/quickPickItem";
import { appConfig } from "../../appConfig";
import * as mock from "../mocks/extensionController.mock";

const proxyquire = require("proxyquire");

describe("extensionController", () => {
  let context: vscode.ExtensionContext;
  let extensionController: ExtensionController;
  let extensionControllerAny: any;

  before(() => {
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

  beforeEach(() => {
    extensionControllerAny = extensionController as any;
  });

  afterEach(() => {
    sinon.restore();
  });
  describe("showQuickPick", () => {
    it("should load data and show quickPick", async () => {
      const showStub = sinon.stub(extensionControllerAny.quickPick, "show");
      const loadQuickPickDataStub = sinon.stub(
        extensionControllerAny.quickPick,
        "loadQuickPickData"
      );

      await extensionControllerAny.showQuickPick();
      assert.equal(showStub.calledOnce, true);
      assert.equal(loadQuickPickDataStub.calledOnce, true);
    });
  });

  describe("clearCache", () => {
    it("should invoke cache clearing function on cache object", async () => {
      const stub = sinon.stub(extensionControllerAny.cache, "clearCache");

      await extensionControllerAny.clearCache();
      assert.equal(stub.calledOnce, true);
    });
  });

  // describe("onQuickPickSubmit", () => {
  //   it("should invoke openInBrowser function with search url if value is string", async () => {
  //     const openInBrowserStub = sinon
  //       .stub(extensionControllerAny, "openInBrowser")
  //       .returns(Promise.resolve());
  //     sinon
  //       .stub(appConfig, "searchUrl")
  //       .value("https://developer.mozilla.org/search");
  //     sinon
  //       .stub(extensionControllerAny.dataService, "isHigherLevelDataEmpty")
  //       .returns(true);
  //     const text = "test search text";

  //     await extensionControllerAny.onQuickPickSubmit(text);

  //     const actual = openInBrowserStub.withArgs(
  //       "https://developer.mozilla.org/search?q=test+search+text"
  //     ).calledOnce;
  //     const expected = true;
  //     assert.equal(actual, expected);
  //   });

  //   it("should do nothing if value is string but higherLevelData array is not empty", async () => {
  //     const openInBrowserStub = sinon
  //       .stub(extensionControllerAny, "openInBrowser")
  //       .returns(Promise.resolve());
  //     sinon
  //       .stub(appConfig, "searchUrl")
  //       .value("https://developer.mozilla.org/search");
  //     sinon
  //       .stub(extensionControllerAny.dataService, "isHigherLevelDataEmpty")
  //       .returns(false);
  //     const text = "test search text";

  //     await extensionControllerAny.onQuickPickSubmit(text);
  //     const actual = openInBrowserStub.calledOnce;
  //     const expected = false;
  //     assert.equal(actual, expected);
  //   });

  //   it("should invoke openInBrowser function with item url if value is QuickPickItem with ItemType.File", async () => {
  //     const openInBrowserStub = sinon
  //       .stub(extensionControllerAny, "openInBrowser")
  //       .returns(Promise.resolve());
  //     const qpItem: QuickPickItem = mock.qpItem;

  //     await extensionControllerAny.onQuickPickSubmit(qpItem);
  //     const actual = openInBrowserStub.withArgs("http://test.com").calledOnce;
  //     const expected = true;
  //     assert.equal(actual, expected);
  //   });

  //   it("should invoke loadQuickPickData function with item url if value is QuickPickItem with ItemType.Directory", async () => {
  //     const loadQuickPickDataStub = sinon
  //       .stub(extensionControllerAny, "loadQuickPickData")
  //       .returns(Promise.resolve());
  //     const qpItem: QuickPickItem = mock.qpItemDirectoryType;

  //     await extensionControllerAny.onQuickPickSubmit(qpItem);

  //     const actual = loadQuickPickDataStub.withArgs(qpItem).calledOnce;
  //     const expected = true;
  //     assert.equal(actual, expected);
  //   });

  //   it("should catch error and invoke vscode.window.showErrorMessage", async () => {
  //     const showErrorMessageStub = sinon.stub(
  //       vscode.window,
  //       "showErrorMessage"
  //     );
  //     sinon
  //       .stub(extensionControllerAny.utils, "getSearchUrl")
  //       .throws("test error message");

  //     await extensionControllerAny.onQuickPickSubmit("test search text");

  //     const actual = showErrorMessageStub.calledOnce;
  //     const expected = true;
  //     assert.equal(actual, expected);
  //   });
  // });

  // describe("loadQuickPickData", () => {
  //   it("should load flat list of items", async () => {
  //     sinon
  //       .stub(extensionControllerAny.config, "shouldDisplayFlatList")
  //       .returns(true);
  //     const qpItems: QuickPickItem[] = mock.qpItems;
  //     sinon
  //       .stub(extensionControllerAny.dataService, "getFlatQuickPickData")
  //       .returns(Promise.resolve(qpItems));

  //     await extensionControllerAny.loadQuickPickData();

  //     const actual = extensionControllerAny.quickPick.quickPick.items;
  //     const expected = qpItems;
  //     assert.deepEqual(actual, expected);
  //   });

  //   it("should load list of items", async () => {
  //     sinon
  //       .stub(extensionControllerAny.config, "shouldDisplayFlatList")
  //       .returns(false);
  //     const qpItem: QuickPickItem = mock.qpItemDirectoryType;
  //     const qpItems: QuickPickItem[] = mock.qpItems;
  //     sinon
  //       .stub(extensionControllerAny.dataService, "getQuickPickData")
  //       .returns(Promise.resolve(qpItems));

  //     await extensionControllerAny.loadQuickPickData(qpItem);

  //     const actual = extensionControllerAny.quickPick.quickPick.items;
  //     const expected = qpItems;
  //     assert.deepEqual(actual, expected);
  //   });

  //   it("should load list of root items", async () => {
  //     sinon
  //       .stub(extensionControllerAny.config, "shouldDisplayFlatList")
  //       .returns(false);
  //     const qpItems: QuickPickItem[] = mock.qpItems;
  //     sinon
  //       .stub(extensionControllerAny.dataService, "getQuickPickRootData")
  //       .returns(Promise.resolve(qpItems));

  //     await extensionControllerAny.loadQuickPickData();

  //     const actual = extensionControllerAny.quickPick.quickPick.items;
  //     const expected = qpItems;
  //     assert.deepEqual(actual, expected);
  //   });
  // });

  // describe("prepareQuickPickPlaceholder", () => {
  //   it("should invoke clearQuickPickPlaceholder if higherLevelData is not empty", () => {
  //     sinon.stub(extensionControllerAny, "higherLevelData").value([1]);
  //     const spy = sinon.stub(
  //       extensionControllerAny,
  //       "clearQuickPickPlaceholder"
  //     );

  //     extensionControllerAny.prepareQuickPickPlaceholder();

  //     const actual = spy.calledOnce;
  //     const expected = true;
  //     assert.equal(actual, expected);
  //   });

  //   it("should invoke setQuickPickPlaceholder if higherLevelData is empty", () => {
  //     sinon.stub(extensionControllerAny, "higherLevelData").value([]);
  //     const spy = sinon.stub(extensionControllerAny, "setQuickPickPlaceholder");

  //     extensionControllerAny.prepareQuickPickPlaceholder();

  //     const actual = spy.calledOnce;
  //     const expected = true;
  //     assert.equal(actual, expected);
  //   });
  // });

  // describe("setQuickPickPlaceholder", () => {
  //   it("should invoke quickPick.setPlaceholder function", async () => {
  //     const spy = sinon.stub(
  //       extensionControllerAny.quickPick,
  //       "setPlaceholder"
  //     );
  //     const text = "choose item from the list or type anything to search";

  //     extensionControllerAny.setQuickPickPlaceholder();

  //     const actual = spy.withArgs(text).calledOnce;
  //     const expected = true;
  //     assert.equal(actual, expected);
  //   });
  // });

  // describe("clearQuickPickPlaceholder", () => {
  //   it("should invoke quickPick.setPlaceholder function with undefined parameter", async () => {
  //     const stub = sinon.stub(
  //       extensionControllerAny.quickPick,
  //       "setPlaceholder"
  //     );

  //     extensionControllerAny.clearQuickPickPlaceholder();

  //     const actual = stub.withArgs(undefined).calledOnce;
  //     const expected = true;
  //     assert.equal(actual, expected);
  //   });
  // });

  // describe("openInBrowser", () => {
  //   it("should invoke open function", async () => {
  //     const openStub = sinon.stub().returns(Promise.resolve());
  //     const ProxiedExtensionController = proxyquire(
  //       "../../ExtensionController",
  //       {
  //         open: openStub,
  //       }
  //     ).default;
  //     extensionControllerAny = new ProxiedExtensionController(context);

  //     await extensionControllerAny.openInBrowser("http://test.com");

  //     const actual = openStub.withArgs("http://test.com").calledOnce;
  //     const expected = true;
  //     assert.equal(actual, expected);
  //   });
  // });

  // describe("onWillGoLowerTreeLevel", () => {
  //   it("should invoke dataService.rememberHigherLevelQpData method with qpItems as parameter", () => {
  //     sinon
  //       .stub(extensionControllerAny.quickPick, "getItems")
  //       .returns(mock.qpItems);
  //     const rememberHigherLevelQpDataStub = sinon.stub(
  //       extensionControllerAny.dataService,
  //       "rememberHigherLevelQpData"
  //     );

  //     extensionControllerAny.onWillGoLowerTreeLevel();

  //     const actual = rememberHigherLevelQpDataStub.withArgs(mock.qpItems)
  //       .calledOnce;
  //     const expected = true;
  //     assert.equal(actual, expected);
  //   });
  // });
});
