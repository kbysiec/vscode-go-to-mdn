import { assert } from "chai";
import * as sinon from "sinon";
import QuickPick from "../../quickPick";
import * as mock from "../mocks/quickPick.mock";
import Cache from "../../cache";
import { getCacheStub, getUtilsStub } from "../util/mockFactory";
import { appConfig } from "../../appConfig";
import Utils from "../../utils";
import { stubMultiple, restoreStubbedMultiple } from "../util/stubUtils";

describe("Quick Pick", () => {
  let quickPick: QuickPick;
  let quickPickAny: any;
  let utilsStub: Utils;
  let cacheStub: Cache;

  beforeEach(() => {
    utilsStub = getUtilsStub();
    cacheStub = getCacheStub();
    quickPick = new QuickPick(cacheStub, utilsStub);
    quickPickAny = quickPick as any;
  });

  describe("registerEventListeners", () => {
    it("should register onDidHide and onDidAccept event listeners", () => {
      const [onDidHideStub, onDidAcceptStub] = stubMultiple([
        { object: quickPickAny.quickPick, method: "onDidHide" },
        { object: quickPickAny.quickPick, method: "onDidAccept" },
      ]);

      quickPick.registerEventListeners();

      assert.equal(onDidHideStub.calledOnce, true);
      assert.equal(onDidAcceptStub.calledOnce, true);
    });

    it("should register one onDidChangeValue event listener if config.shouldDisplayFlatList returns false", () => {
      const [onDidChangeValueStub] = stubMultiple([
        { object: quickPickAny.quickPick, method: "onDidChangeValue" },
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
      ]);

      quickPick.registerEventListeners();

      assert.equal(onDidChangeValueStub.calledOnce, true);
    });

    it("should register two onDidChangeValue event listeners if config.shouldDisplayFlatList returns true", () => {
      const [onDidChangeValueStub] = stubMultiple([
        { object: quickPickAny.quickPick, method: "onDidChangeValue" },
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
      ]);

      quickPick.registerEventListeners();

      assert.equal(onDidChangeValueStub.calledTwice, true);
    });
  });

  describe("show", () => {
    it("should vscode.quickPick.show function be called", () => {
      const [showStub] = stubMultiple([
        { object: quickPickAny.quickPick, method: "show" },
      ]);
      quickPick.show();

      assert.equal(showStub.calledOnce, true);
    });
  });

  describe("hide", () => {
    it("should vscode.quickPick.hide function be called", () => {
      const [hideStub] = stubMultiple([
        { object: quickPickAny.quickPick, method: "hide" },
      ]);
      quickPick.hide();

      assert.equal(hideStub.calledOnce, true);
    });
  });

  describe("loadQuickPickData", () => {
    it("should load flat list of items", async () => {
      stubMultiple([
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
        {
          object: quickPickAny.dataService,
          method: "getFlatQuickPickData",
          returns: Promise.resolve(mock.qpItems),
        },
      ]);

      await quickPickAny.loadQuickPickData();

      assert.deepEqual(quickPickAny.quickPick.items, mock.qpItems);
    });

    it("should load list of items", async () => {
      stubMultiple([
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
        {
          object: quickPickAny.dataService,
          method: "getQuickPickData",
          returns: Promise.resolve(mock.qpItems),
        },
      ]);

      await quickPickAny.loadQuickPickData(mock.qpItem);

      assert.deepEqual(quickPickAny.quickPick.items, mock.qpItems);
    });

    it("should load list of root items", async () => {
      stubMultiple([
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
        {
          object: quickPickAny.dataService,
          method: "getQuickPickRootData",
          returns: Promise.resolve(mock.qpItems),
        },
      ]);

      await quickPickAny.loadQuickPickData();

      assert.deepEqual(quickPickAny.quickPick.items, mock.qpItems);
    });

    it(`should placeholder be set to undefined
      if dataService.isHigherLevelDataEmpty method returns false`, async () => {
      stubMultiple([
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
        {
          object: quickPickAny.dataService,
          method: "isHigherLevelDataEmpty",
          returns: false,
        },
        {
          object: quickPickAny.dataService,
          method: "getQuickPickRootData",
          returns: Promise.resolve(mock.qpItems),
        },
      ]);

      await quickPickAny.loadQuickPickData();

      assert.equal(quickPickAny.quickPick.placeholder, undefined);
    });

    it(`should placeholder be set to 'choose item from the list or type anything to search'
      if dataService.isHigherLevelDataEmpty method returns true`, async () => {
      stubMultiple([
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
        {
          object: quickPickAny.dataService,
          method: "isHigherLevelDataEmpty",
          returns: true,
        },
        {
          object: quickPickAny.dataService,
          method: "getQuickPickRootData",
          returns: Promise.resolve(mock.qpItems),
        },
      ]);

      await quickPickAny.loadQuickPickData();

      assert.equal(
        quickPickAny.quickPick.placeholder,
        "choose item from the list or type anything to search"
      );
    });
  });

  describe("submit", () => {
    beforeEach(() => {});
    it("should invoke open function", async () => {
      sinon.restore();
      const [openStub] = stubMultiple([
        {
          object: quickPickAny,
          method: "open",
          returns: Promise.resolve(),
        },
      ]);

      await quickPickAny.submit(mock.qpItem);

      assert.equal(openStub.withArgs("http://test.com").calledOnce, true);
    });

    it("should invoke open function with search url if value is string", async () => {
      sinon.restore();
      const [openStub] = stubMultiple([
        {
          object: quickPickAny,
          method: "open",
          returns: Promise.resolve(),
        },
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
          returns: true,
        },
        {
          object: quickPickAny.dataService,
          method: "isHigherLevelDataEmpty",
          returns: true,
        },
        {
          object: quickPickAny.quickPick,
          method: "value",
          returns: "test search text",
          isNotMethod: true,
        },
        {
          object: appConfig,
          method: "searchUrl",
          returns: "https://developer.mozilla.org/search",
          isNotMethod: true,
        },
      ]);

      await quickPickAny.submit(undefined);

      assert.equal(
        openStub.withArgs(
          "https://developer.mozilla.org/search?q=test+search+text"
        ).calledOnce,
        true
      );
    });

    it("should do nothing if value is string and higherLevelData array is not empty", async () => {
      restoreStubbedMultiple([
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
        },
      ]);

      const [openInBrowserStub] = stubMultiple([
        {
          object: quickPickAny,
          method: "openInBrowser",
          returns: Promise.resolve(),
        },
        {
          object: appConfig,
          method: "searchUrl",
          returns: "https://developer.mozilla.org/search",
          isNotMethod: true,
        },
        {
          object: quickPickAny.dataService,
          method: "isHigherLevelDataEmpty",
          returns: false,
        },
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
          returns: true,
        },
        {
          object: quickPickAny.quickPick,
          method: "value",
          returns: "test search text",
          isNotMethod: true,
        },
      ]);

      await quickPickAny.submit(undefined);

      assert.equal(openInBrowserStub.calledOnce, false);
    });

    it("should invoke openInBrowser function with item url if value is QuickPickItem with ItemType.File", async () => {
      restoreStubbedMultiple([
        { object: quickPickAny.utils, method: "isValueStringType" },
        { object: quickPickAny.utils, method: "isValueFileType" },
      ]);

      const [openInBrowserStub] = stubMultiple([
        {
          object: quickPickAny,
          method: "openInBrowser",
          returns: Promise.resolve(),
        },
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
          returns: false,
        },
        {
          object: quickPickAny.utils,
          method: "isValueFileType",
          returns: true,
        },
      ]);

      await quickPickAny.submit(mock.qpItem);

      assert.equal(
        openInBrowserStub.withArgs("http://test.com").calledOnce,
        true
      );
    });

    it("should invoke loadQuickPickData function with item url if value is QuickPickItem with ItemType.Directory", async () => {
      const [loadQuickPickDataStub] = stubMultiple([
        {
          object: quickPickAny,
          method: "loadQuickPickData",
          returns: Promise.resolve(),
        },
      ]);

      await quickPickAny.submit(mock.qpItemDirectoryType);

      assert.equal(
        loadQuickPickDataStub.withArgs(mock.qpItemDirectoryType).calledOnce,
        true
      );
    });

    it("should catch error and invoke utils.printErrorMessage", async () => {
      restoreStubbedMultiple([
        { object: quickPickAny.utils, method: "isValueStringType" },
        { object: quickPickAny.utils, method: "printErrorMessage" },
      ]);

      const [printErrorMessageStub] = stubMultiple([
        { object: quickPickAny.utils, method: "printErrorMessage" },
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
          returns: true,
        },
        {
          object: quickPickAny,
          method: "processIfValueIsStringType",
          throws: "test error message",
        },
      ]);

      await quickPickAny.submit("test search text");

      assert.equal(printErrorMessageStub.calledOnce, true);
    });
  });

  describe("onDidAccept", () => {
    it("should have selected item", () => {
      const [submitStub] = stubMultiple([
        { object: quickPickAny, method: "submit" },
        {
          object: quickPickAny.quickPick,
          method: "selectedItems",
          returns: [mock.qpItem],
          isNotMethod: true,
        },
      ]);

      quickPickAny.onDidAccept();

      assert.equal(submitStub.calledWith(mock.qpItem), true);
    });
  });

  describe("onDidHide", () => {
    it("should quick pick text to be cleared", () => {
      const [clearTextStub] = stubMultiple([
        { object: quickPickAny, method: "clearText" },
      ]);

      quickPickAny.onDidHide();

      assert.deepEqual(clearTextStub.calledOnce, true);
    });
  });

  describe("onDidChangeValueClearing", () => {
    it("should quick pick items be cleared", () => {
      quickPickAny.onDidChangeValueClearing();

      assert.deepEqual(quickPickAny.quickPick.items, []);
    });
  });

  describe("onDidChangeValue", () => {
    it("should contain items matching the search query", () => {
      const searchQuery = "test";
      quickPickAny.items = mock.qpItems;
      quickPickAny.onDidChangeValue(searchQuery);

      assert.deepEqual(quickPickAny.quickPick.items.length, 2);
    });
  });

  describe("onWillGoLowerTreeLevel", () => {
    it("should invoke dataService.rememberHigherLevelQpData method with qpItems as parameter", () => {
      const [rememberHigherLevelQpDataStub] = stubMultiple([
        {
          object: quickPickAny.dataService,
          method: "rememberHigherLevelQpData",
        },
        {
          object: quickPickAny.quickPick,
          method: "items",
          returns: mock.qpItems,
          isNotMethod: true,
        },
      ]);

      quickPickAny.onWillGoLowerTreeLevel();

      assert.equal(
        rememberHigherLevelQpDataStub.withArgs(mock.qpItems).calledOnce,
        true
      );
    });
  });
});
