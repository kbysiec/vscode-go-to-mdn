import { assert } from "chai";
import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import Cache from "../../cache";
import QuickPick from "../../quickPick";
import * as mock from "../mock/quickPick.mock";
import { getTestSetups } from "../testSetup/quickPick.testSetup";
import { getCacheStub } from "../util/mockFactory";

const ProxiedQuickPick = proxyquire("../../quickPick", {
  getSearchUrl: sinon.stub(),
  isValueFileType: sinon.stub(),
  isValueStringType: sinon.stub(),
  printErrorMessage: sinon.stub(),
}).default;

describe("Quick Pick", () => {
  let cacheStub: Cache = getCacheStub();
  let quickPick: QuickPick = new ProxiedQuickPick(cacheStub);
  let quickPickAny: any;
  let setups = getTestSetups(quickPick);

  beforeEach(() => {
    cacheStub = getCacheStub();
    quickPick = new ProxiedQuickPick(cacheStub);
    quickPickAny = quickPick as any;
    setups = getTestSetups(quickPick);
  });

  describe("registerEventListeners", () => {
    it("1: should register onDidHide and onDidAccept event listeners", () => {
      const [onDidHideStub, onDidAcceptStub] = setups.registerEventListeners1();
      quickPick.registerEventListeners();

      assert.equal(onDidHideStub.calledOnce, true);
      assert.equal(onDidAcceptStub.calledOnce, true);
    });

    it("2: should register one onDidChangeValue event listener if config.shouldDisplayFlatList returns false", () => {
      const [onDidChangeValueStub] = setups.registerEventListeners2();
      quickPick.registerEventListeners();
      assert.equal(onDidChangeValueStub.calledOnce, true);
    });

    it("3: should register two onDidChangeValue event listeners if config.shouldDisplayFlatList returns true", () => {
      const [onDidChangeValueStub] = setups.registerEventListeners3();
      quickPick.registerEventListeners();
      assert.equal(onDidChangeValueStub.calledTwice, true);
    });
  });

  describe("show", () => {
    it("1: should vscode.quickPick.show function be called", () => {
      const [showStub] = setups.show1();
      quickPick.show();
      assert.equal(showStub.calledOnce, true);
    });
  });

  describe("hide", () => {
    it("1: should vscode.quickPick.hide function be called", () => {
      const [hideStub] = setups.hide1();
      quickPick.hide();
      assert.equal(hideStub.calledOnce, true);
    });
  });

  describe("loadQuickPickData", () => {
    it("1: should load flat list of items", async () => {
      setups.loadQuickPickData1();
      await quickPick.loadQuickPickData();
      assert.deepEqual(quickPickAny.quickPick.items, mock.qpItems);
    });

    it("2: should load list of items", async () => {
      setups.loadQuickPickData2();
      await quickPick.loadQuickPickData(mock.qpItem);
      assert.deepEqual(quickPickAny.quickPick.items, mock.qpItems);
    });

    it("3: should load list of root items", async () => {
      setups.loadQuickPickData3();
      await quickPick.loadQuickPickData();
      assert.deepEqual(quickPickAny.quickPick.items, mock.qpItems);
    });

    it(`4: should placeholder be set to empty string
      if dataService.isHigherLevelDataEmpty method returns false`, async () => {
      setups.loadQuickPickData4();
      await quickPick.loadQuickPickData();
      assert.equal(quickPickAny.quickPick.placeholder, "");
    });

    it(`5: should placeholder be set to 'choose item from the list or type anything to search'
      if dataService.isHigherLevelDataEmpty method returns true`, async () => {
      setups.loadQuickPickData5();
      await quickPick.loadQuickPickData();

      assert.equal(
        quickPickAny.quickPick.placeholder,
        "choose item from the list or type anything to search"
      );
    });
  });

  describe("submit", () => {
    it("1: should invoke open function", async () => {
      const [openStub] = setups.submit1();
      await quickPickAny.submit(mock.qpItem);
      assert.equal(openStub.withArgs("http://test.com").calledOnce, true);
    });

    it("2: should invoke open function with search url if value is string", async () => {
      const [openStub] = setups.submit2();
      await quickPickAny.submit(undefined);

      assert.equal(
        openStub.withArgs(
          "https://developer.mozilla.org/search?q=test+search+text"
        ).calledOnce,
        true
      );
    });

    it("3: should do nothing if value is string and higherLevelData array is not empty", async () => {
      const [openInBrowserStub] = setups.submit3();
      await quickPickAny.submit(undefined);
      assert.equal(openInBrowserStub.calledOnce, false);
    });

    it("4: should invoke openInBrowser function with item url if value is QuickPickItem with ItemType.File", async () => {
      const [openInBrowserStub] = setups.submit4();
      await quickPickAny.submit(mock.qpItem);

      assert.equal(
        openInBrowserStub.withArgs("http://test.com").calledOnce,
        true
      );
    });

    it("5: should invoke loadQuickPickData function with item url if value is QuickPickItem with ItemType.Directory", async () => {
      const [loadQuickPickDataStub] = setups.submit5();
      await quickPickAny.submit(mock.qpItemDirectoryType);

      assert.equal(
        loadQuickPickDataStub.withArgs(mock.qpItemDirectoryType).calledOnce,
        true
      );
    });

    it("6: should catch error and invoke utils.printErrorMessage", async () => {
      const [printErrorMessageStub] = setups.submit6();
      await quickPickAny.submit("test search text");
      assert.equal(printErrorMessageStub.calledOnce, true);
    });
  });

  describe("onDidAccept", () => {
    it("1: should have selected item", () => {
      const [submitStub] = setups.onDidAccept1();
      quickPickAny.onDidAccept();
      assert.equal(submitStub.calledWith(mock.qpItem), true);
    });
  });

  describe("onDidHide", () => {
    it("1: should quick pick text to be cleared", () => {
      const [clearTextStub] = setups.onDidHide1();
      quickPickAny.onDidHide();
      assert.deepEqual(clearTextStub.calledOnce, true);
    });
  });

  describe("onDidChangeValueClearing", () => {
    it("1: should quick pick items be cleared", () => {
      quickPickAny.onDidChangeValueClearing();
      assert.deepEqual(quickPickAny.quickPick.items, []);
    });
  });

  describe("onDidChangeValue", () => {
    it("1: should contain items matching the search query", () => {
      const searchQuery = "test";
      quickPickAny.items = mock.qpItems;
      quickPickAny.onDidChangeValue(searchQuery);

      assert.deepEqual(quickPickAny.quickPick.items.length, 2);
    });
  });

  describe("onWillGoLowerTreeLevel", () => {
    it("1: should invoke dataService.rememberHigherLevelQpData method with qpItems as parameter", () => {
      const [rememberHigherLevelQpDataStub] = setups.onWillGoLowerTreeLevel1();
      quickPickAny.onWillGoLowerTreeLevel();

      assert.equal(
        rememberHigherLevelQpDataStub.withArgs(mock.qpItems).calledOnce,
        true
      );
    });
  });
});
