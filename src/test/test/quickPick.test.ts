import { assert } from "chai";
import { createQuickPick } from "../../quickPick";
import * as mock from "../mock/quickPick.mock";
import { getTestSetups } from "../testSetup/quickPick.testSetup";

type QuickPick = ReturnType<typeof createQuickPick>;
type SetupsType = ReturnType<typeof getTestSetups>;

describe("Quick Pick", () => {
  let setups: SetupsType;
  let quickPick: QuickPick;

  before(() => {
    setups = getTestSetups();
    quickPick = setups.before();
  });
  afterEach(() => setups.afterEach());

  describe("registerEventListeners", () => {
    it("1: should register onDidHide and onDidAccept event listeners", () => {
      const [onDidHideStub, onDidAcceptStub] = setups.registerEventListeners1();
      quickPick.registerEventListeners();

      assert.equal(onDidHideStub.calledOnce, true);
      assert.equal(onDidAcceptStub.calledOnce, true);
    });

    it("2: should register two onDidChangeValue event listeners", () => {
      const [onDidChangeValueStub] = setups.registerEventListeners2();
      quickPick.registerEventListeners();
      assert.equal(onDidChangeValueStub.calledTwice, true);
    });
  });

  describe("show", () => {
    it("1: should vscode.quickPick.show function be called", () => {
      const [showStub] = setups.show1();
      quickPick.showQuickPick();
      assert.equal(showStub.calledOnce, true);
    });
  });

  describe("loadQuickPickData", () => {
    it("1: should load list of items", async () => {
      setups.loadQuickPickData1();
      await quickPick.loadQuickPickData();
      assert.deepEqual(quickPick.quickPickControl!.items, mock.qpItems);
    });
  });

  describe("submit", () => {
    it("1: should invoke open function", async () => {
      const [openStub] = setups.submit1();
      await quickPick.submit(mock.qpItem);
      assert.equal(openStub.withArgs("http://test.com").calledOnce, true);
    });

    it("2: should invoke open function with search url if value is string", async () => {
      const [openStub] = setups.submit2();
      await quickPick.submit(undefined);
      assert.equal(
        openStub.withArgs(
          "https://developer.mozilla.org/search?q=test+search+text"
        ).calledOnce,
        true
      );
    });

    it("3: should invoke openInBrowser function with item url if value is QuickPickItem with ItemType.File", async () => {
      const [openInBrowserStub] = setups.submit3();
      await quickPick.submit(mock.qpItem);
      assert.equal(
        openInBrowserStub.withArgs("http://test.com").calledOnce,
        true
      );
    });

    it("4: should catch error and invoke utils.printErrorMessage", async () => {
      const [printErrorMessageStub] = setups.submit4();
      await quickPick.submit(mock.qpItem);
      assert.equal(printErrorMessageStub.calledOnce, true);
    });
  });

  describe("handleDidAccept", () => {
    it("1: should have selected item", () => {
      const [submitStub] = setups.handleDidAccept1();
      quickPick.handleDidAccept();
      assert.equal(submitStub.calledWith(mock.qpItem), true);
    });
  });

  describe("handleDidHide", () => {
    it("1: should quick pick text to be cleared", () => {
      const [clearTextStub] = setups.handleDidHide1();
      quickPick.handleDidHide();
      assert.deepEqual(clearTextStub.calledOnce, true);
    });
  });

  describe("handleDidChangeValueClearing", () => {
    it("1: should quick pick items be cleared", () => {
      quickPick.handleDidChangeValueClearing();
      assert.deepEqual(quickPick.quickPickControl!.items, []);
    });
  });

  describe("handleDidChangeValue", () => {
    it("1: should contain items matching the search query", () => {
      setups.handleDidChangeValue1();

      const searchQuery = "test";
      quickPick.handleDidChangeValue(searchQuery);

      assert.deepEqual(quickPick.quickPickControl!.items.length, 2);
    });
  });
});
