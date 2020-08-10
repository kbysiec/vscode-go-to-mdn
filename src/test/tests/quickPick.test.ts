import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import QuickPick from "../../quickPick";
import QuickPickItem from "../../interfaces/QuickPickItem";
import * as mock from "../mocks/quickPick.mock";
import Cache from "../../cache";
import { getCacheStub } from "../util/mockFactory";
import { appConfig } from "../../appConfig";

describe("Quick Pick", () => {
  let quickPick: QuickPick;
  let quickPickAny: any;
  let cacheStub: Cache;

  before(() => {
    cacheStub = getCacheStub();
    quickPick = new QuickPick(cacheStub);
  });

  beforeEach(() => {
    quickPickAny = quickPick as any;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("constructor", () => {
    it("should quick pick be initialized", () => {
      quickPick = new QuickPick(cacheStub);
      assert.exists(quickPick);
    });
  });

  describe("registerEventListeners", () => {
    it("should register onDidHide and onDidAccept event listeners", () => {
      const onDidHideStub = sinon.stub(quickPickAny.quickPick, "onDidHide");
      const onDidAcceptStub = sinon.stub(quickPickAny.quickPick, "onDidAccept");

      quickPick.registerEventListeners();

      assert.equal(onDidHideStub.calledOnce, true);
      assert.equal(onDidAcceptStub.calledOnce, true);
    });

    it("should register one onDidChangeValue event listener if config.shouldDisplayFlatList returns false", () => {
      sinon.stub(quickPickAny.config, "shouldDisplayFlatList").returns(false);
      const onDidChangeValueStub = sinon.stub(
        quickPickAny.quickPick,
        "onDidChangeValue"
      );

      quickPick.registerEventListeners();

      assert.equal(onDidChangeValueStub.calledOnce, true);
    });

    it("should register two onDidChangeValue event listeners if config.shouldDisplayFlatList returns true", () => {
      sinon.stub(quickPickAny.config, "shouldDisplayFlatList").returns(true);
      const onDidChangeValueStub = sinon.stub(
        quickPickAny.quickPick,
        "onDidChangeValue"
      );

      quickPick.registerEventListeners();

      assert.equal(onDidChangeValueStub.calledTwice, true);
    });
  });

  describe("show", () => {
    it("should vscode.quickPick.show function be called", () => {
      const showStub = sinon.spy(quickPickAny.quickPick, "show");
      quickPick.show();

      const actual = showStub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("hide", () => {
    it("should vscode.quickPick.hide function be called", () => {
      const hideStub = sinon.spy(quickPickAny.quickPick, "hide");
      quickPick.hide();

      const actual = hideStub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("loadItems and getItems", () => {
    it("should functions exist", () => {
      const expected = "function";
      let actual = typeof quickPick.loadItems;
      assert.equal(actual, expected);
      actual = typeof quickPick.getItems;
      assert.equal(actual, expected);
    });

    it("should items be loaded", () => {
      const qpItems: QuickPickItem[] = mock.qpItems;
      quickPick.loadItems(qpItems);

      const actual = quickPick.getItems().length;
      const expected = 3;
      assert.equal(actual, expected);
    });
  });

  describe("showLoading", () => {
    it("should vscode.quickPick.busy property be set", () => {
      quickPick.showLoading(true);

      const actual = quickPickAny.quickPick.busy;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("setPlaceholder", () => {
    it("should vscode.quickPick.placeholder property be set", () => {
      quickPick.setPlaceholder("test placeholder");

      const actual = quickPickAny.quickPick.placeholder;
      const expected = "test placeholder";
      assert.equal(actual, expected);
    });
  });

  describe("clearText", () => {
    it("should vscode.quickPick.value property be set to empty", () => {
      quickPick.clearText();

      const actual = quickPickAny.quickPick.value;
      const expected = "";
      assert.equal(actual, expected);
    });
  });

  describe("submit", () => {
    it("should invoke openInBrowser function with search url if value is string", async () => {
      const openInBrowserStub = sinon
        .stub(quickPickAny, "openInBrowser")
        .returns(Promise.resolve());
      sinon
        .stub(appConfig, "searchUrl")
        .value("https://developer.mozilla.org/search");
      sinon
        .stub(quickPickAny.dataService, "isHigherLevelDataEmpty")
        .returns(true);
      sinon.stub(quickPickAny.quickPick, "value").value("test search text");

      await quickPickAny.submit(undefined);

      const actual = openInBrowserStub.withArgs(
        "https://developer.mozilla.org/search?q=test+search+text"
      ).calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should do nothing if value is string and higherLevelData array is not empty", async () => {
      const openInBrowserStub = sinon
        .stub(quickPickAny, "openInBrowser")
        .returns(Promise.resolve());
      sinon
        .stub(appConfig, "searchUrl")
        .value("https://developer.mozilla.org/search");
      sinon
        .stub(quickPickAny.dataService, "isHigherLevelDataEmpty")
        .returns(false);
      sinon.stub(quickPickAny.quickPick, "value").value("test search text");

      await quickPickAny.submit(undefined);
      const actual = openInBrowserStub.calledOnce;
      const expected = false;
      assert.equal(actual, expected);
    });

    it("should invoke openInBrowser function with item url if value is QuickPickItem with ItemType.File", async () => {
      const openInBrowserStub = sinon
        .stub(quickPickAny, "openInBrowser")
        .returns(Promise.resolve());
      const qpItem: QuickPickItem = mock.qpItem;

      await quickPickAny.submit(qpItem);
      const actual = openInBrowserStub.withArgs("http://test.com").calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should invoke loadQuickPickData function with item url if value is QuickPickItem with ItemType.Directory", async () => {
      const loadQuickPickDataStub = sinon
        .stub(quickPickAny, "loadQuickPickData")
        .returns(Promise.resolve());
      const qpItem: QuickPickItem = mock.qpItemDirectoryType;

      await quickPickAny.submit(qpItem);

      const actual = loadQuickPickDataStub.withArgs(qpItem).calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should catch error and invoke utils.printErrorMessage", async () => {
      const printErrorMessageStub = sinon.stub(
        quickPickAny.utils,
        "printErrorMessage"
      );
      sinon
        .stub(quickPickAny, "processIfValueIsStringType")
        .throws("test error message");

      await quickPickAny.submit("test search text");

      const actual = printErrorMessageStub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("onDidAccept", () => {
    it("should have selected item", () => {
      const submitStub = sinon.stub(quickPickAny, "submit");
      const qpItem: QuickPickItem = mock.qpItem;
      quickPickAny.quickPick.selectedItems[0] = qpItem;
      quickPickAny.onDidAccept();

      const actual = submitStub.calledWith(qpItem);
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("onDidChangeValueClearing", () => {
    it("should quick pick items be cleared", () => {
      quickPickAny.onDidChangeValueClearing();
      const actual: QuickPickItem[] = quickPickAny.quickPick.items;
      const expected: QuickPickItem[] = [];
      assert.deepEqual(actual, expected);
    });
  });

  describe("onDidChangeValue", () => {
    it("should contain items matching the search query", () => {
      const searchQuery = "test";
      const qpItems: QuickPickItem[] = mock.qpItems;
      quickPickAny.items = qpItems;
      quickPickAny.onDidChangeValue(searchQuery);

      const actual = quickPickAny.quickPick.items.length;
      const expected = 2;
      assert.deepEqual(actual, expected);
    });
  });

  describe("loadQuickPickData", () => {
    it("should load flat list of items", async () => {
      sinon.stub(quickPickAny.config, "shouldDisplayFlatList").returns(true);
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon
        .stub(quickPickAny.dataService, "getFlatQuickPickData")
        .returns(Promise.resolve(qpItems));

      await quickPickAny.loadQuickPickData();

      const actual = quickPickAny.quickPick.items;
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });

    it("should load list of items", async () => {
      sinon.stub(quickPickAny.config, "shouldDisplayFlatList").returns(false);
      const qpItem: QuickPickItem = mock.qpItemDirectoryType;
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon
        .stub(quickPickAny.dataService, "getQuickPickData")
        .returns(Promise.resolve(qpItems));

      await quickPickAny.loadQuickPickData(qpItem);

      const actual = quickPickAny.quickPick.items;
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });

    it("should load list of root items", async () => {
      sinon.stub(quickPickAny.config, "shouldDisplayFlatList").returns(false);
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon
        .stub(quickPickAny.dataService, "getQuickPickRootData")
        .returns(Promise.resolve(qpItems));

      await quickPickAny.loadQuickPickData();

      const actual = quickPickAny.quickPick.items;
      const expected = qpItems;
      assert.deepEqual(actual, expected);
    });
  });

  describe("preparePlaceholder", () => {
    it("should invoke setPlaceholder with undefined as parameter if higherLevelData is not empty", () => {
      sinon.stub(quickPickAny.dataService, "higherLevelData").value([1]);
      const setPlaceholderStub = sinon.stub(quickPickAny, "setPlaceholder");

      quickPickAny.preparePlaceholder();

      const actual = setPlaceholderStub.withArgs(undefined).calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should invoke setQuickPickPlaceholder if higherLevelData is empty", () => {
      sinon.stub(quickPickAny.dataService, "higherLevelData").value([]);
      const setPlaceholderStub = sinon.stub(quickPickAny, "setPlaceholder");

      quickPickAny.preparePlaceholder();

      const actual = setPlaceholderStub.withArgs(
        "choose item from the list or type anything to search"
      ).calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("openInBrowser", () => {
    it("should invoke open function", async () => {
      const openStub = sinon
        .stub(quickPickAny, "open")
        .returns(Promise.resolve());

      await quickPickAny.openInBrowser("http://test.com");

      const actual = openStub.withArgs("http://test.com").calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("onWillGoLowerTreeLevel", () => {
    it("should invoke dataService.rememberHigherLevelQpData method with qpItems as parameter", () => {
      sinon.stub(quickPickAny, "getItems").returns(mock.qpItems);
      const rememberHigherLevelQpDataStub = sinon.stub(
        quickPickAny.dataService,
        "rememberHigherLevelQpData"
      );

      quickPickAny.onWillGoLowerTreeLevel();

      const actual = rememberHigherLevelQpDataStub.withArgs(mock.qpItems)
        .calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });
});
