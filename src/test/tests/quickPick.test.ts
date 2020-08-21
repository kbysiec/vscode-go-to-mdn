import { assert } from "chai";
import * as sinon from "sinon";
import QuickPick from "../../quickPick";
import QuickPickItem from "../../interfaces/QuickPickItem";
import * as mock from "../mocks/quickPick.mock";
import Cache from "../../cache";
import { getCacheStub, getUtilsStub } from "../util/mockFactory";
import { appConfig } from "../../appConfig";
import Utils from "../../utils";

describe("Quick Pick", () => {
  let quickPick: QuickPick;
  let quickPickAny: any;
  let utilsStub: Utils;
  let cacheStub: Cache;

  before(() => {
    utilsStub = getUtilsStub();
    cacheStub = getCacheStub();
    quickPick = new QuickPick(cacheStub, utilsStub);
    quickPickAny = quickPick as any;
  });

  afterEach(() => {
    sinon.restore();
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

      assert.equal(showStub.calledOnce, true);
    });
  });

  describe("hide", () => {
    it("should vscode.quickPick.hide function be called", () => {
      const hideStub = sinon.spy(quickPickAny.quickPick, "hide");
      quickPick.hide();

      assert.equal(hideStub.calledOnce, true);
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

      assert.deepEqual(quickPickAny.quickPick.items, qpItems);
    });

    it("should load list of items", async () => {
      sinon.stub(quickPickAny.config, "shouldDisplayFlatList").returns(false);
      const qpItem: QuickPickItem = mock.qpItemDirectoryType;
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon
        .stub(quickPickAny.dataService, "getQuickPickData")
        .returns(Promise.resolve(qpItems));

      await quickPickAny.loadQuickPickData(qpItem);

      assert.deepEqual(quickPickAny.quickPick.items, qpItems);
    });

    it("should load list of root items", async () => {
      sinon.stub(quickPickAny.config, "shouldDisplayFlatList").returns(false);
      const qpItems: QuickPickItem[] = mock.qpItems;
      sinon
        .stub(quickPickAny.dataService, "getQuickPickRootData")
        .returns(Promise.resolve(qpItems));

      await quickPickAny.loadQuickPickData();

      assert.deepEqual(quickPickAny.quickPick.items, qpItems);
    });

    it(`should placeholder be set to undefined
      if dataService.isHigherLevelDataEmpty method returns false`, async () => {
      sinon.stub(quickPickAny.config, "shouldDisplayFlatList").returns(false);
      sinon
        .stub(quickPickAny.dataService, "isHigherLevelDataEmpty")
        .returns(false);
      sinon
        .stub(quickPickAny.dataService, "getQuickPickRootData")
        .returns(Promise.resolve(mock.qpItems));

      await quickPickAny.loadQuickPickData();

      assert.equal(quickPickAny.quickPick.placeholder, undefined);
    });

    it(`should placeholder be set to 'choose item from the list or type anything to search'
      if dataService.isHigherLevelDataEmpty method returns true`, async () => {
      sinon.stub(quickPickAny.config, "shouldDisplayFlatList").returns(false);
      sinon
        .stub(quickPickAny.dataService, "isHigherLevelDataEmpty")
        .returns(true);
      sinon
        .stub(quickPickAny.dataService, "getQuickPickRootData")
        .returns(Promise.resolve(mock.qpItems));

      await quickPickAny.loadQuickPickData();

      assert.equal(
        quickPickAny.quickPick.placeholder,
        "choose item from the list or type anything to search"
      );
    });
  });

  describe("submit", () => {
    it("should invoke open function", async () => {
      const openStub = sinon
        .stub(quickPickAny, "open")
        .returns(Promise.resolve());

      await quickPickAny.openInBrowser("http://test.com");

      const actual = openStub.withArgs("http://test.com").calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should invoke open function with search url if value is string", async () => {
      const openStub = sinon
        .stub(quickPickAny, "open")
        .returns(Promise.resolve());
      sinon
        .stub(appConfig, "searchUrl")
        .value("https://developer.mozilla.org/search");
      sinon
        .stub(quickPickAny.dataService, "isHigherLevelDataEmpty")
        .returns(true);
      sinon.stub(quickPickAny.quickPick, "value").value("test search text");

      await quickPickAny.submit(undefined);

      const actual = openStub.withArgs(
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

      assert.equal(openInBrowserStub.calledOnce, false);
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

      assert.equal(loadQuickPickDataStub.withArgs(qpItem).calledOnce, true);
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

      assert.equal(printErrorMessageStub.calledOnce, true);
    });
  });

  describe("onDidAccept", () => {
    it("should have selected item", () => {
      const submitStub = sinon.stub(quickPickAny, "submit");
      const qpItem: QuickPickItem = mock.qpItem;
      quickPickAny.quickPick.selectedItems[0] = qpItem;
      quickPickAny.onDidAccept();

      assert.equal(submitStub.calledWith(qpItem), true);
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

      assert.deepEqual(quickPickAny.quickPick.items.length, 2);
    });
  });

  describe("onWillGoLowerTreeLevel", () => {
    it("should invoke dataService.rememberHigherLevelQpData method with qpItems as parameter", () => {
      sinon.stub(quickPickAny.quickPick, "items").value(mock.qpItems);
      const rememberHigherLevelQpDataStub = sinon.stub(
        quickPickAny.dataService,
        "rememberHigherLevelQpData"
      );

      quickPickAny.onWillGoLowerTreeLevel();

      assert.equal(
        rememberHigherLevelQpDataStub.withArgs(mock.qpItems).calledOnce,
        true
      );
    });
  });
});
