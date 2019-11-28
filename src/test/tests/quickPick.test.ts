import { assert } from "chai";
import * as sinon from "sinon";
import QuickPick from "../../quickPick";
import QuickPickExtendedItem from "../../interfaces/QuickPickExtendedItem";
import * as mock from "../mocks/quickPick.mock";

describe("Quick Pick", function() {
  let quickPick: QuickPick;
  let quickPickAny: any;
  let onQuickPickSubmitCallback: sinon.SinonSpy<any, any>;
  const shouldDebounce = true;

  before(function() {
    onQuickPickSubmitCallback = sinon.stub();
    quickPick = new QuickPick(onQuickPickSubmitCallback, shouldDebounce);
  });

  beforeEach(function() {
    quickPickAny = quickPick as any;
  });

  afterEach(function() {
    sinon.restore();
  });

  describe("constructor", function() {
    it("should quick pick be initialized", function() {
      quickPick = new QuickPick(onQuickPickSubmitCallback);
      assert.exists(quickPick);
      quickPick = new QuickPick(onQuickPickSubmitCallback, shouldDebounce);
      assert.exists(quickPick);
    });
  });

  describe("show", function() {
    it("should function exist", function() {
      const actual = typeof quickPick.show;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should vscode.quickPick.show function be called", function() {
      const showStub = sinon.spy(quickPickAny.quickPick, "show");
      quickPick.show();

      const actual = showStub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("hide", function() {
    it("should function exist", function() {
      const actual = typeof quickPick.hide;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should vscode.quickPick.hide function be called", function() {
      const hideStub = sinon.spy(quickPickAny.quickPick, "hide");
      quickPick.hide();

      const actual = hideStub.calledOnce;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("loadItems and getItems", function() {
    it("should functions exist", function() {
      const expected = "function";
      let actual = typeof quickPick.loadItems;
      assert.equal(actual, expected);
      actual = typeof quickPick.getItems;
      assert.equal(actual, expected);
    });

    it("should items be loaded", function() {
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      quickPick.loadItems(qpItems);

      const actual = quickPick.getItems().length;
      const expected = 3;
      assert.equal(actual, expected);
    });
  });

  describe("showLoading", function() {
    it("should function exist", function() {
      const actual = typeof quickPick.showLoading;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should vscode.quickPick.busy property be set", function() {
      quickPick.showLoading(true);

      const actual = quickPickAny.quickPick.busy;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("setPlaceholder", function() {
    it("should function exist", function() {
      const actual = typeof quickPick.setPlaceholder;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should vscode.quickPick.placeholder property be set", function() {
      quickPick.setPlaceholder("test placeholder");

      const actual = quickPickAny.quickPick.placeholder;
      const expected = "test placeholder";
      assert.equal(actual, expected);
    });
  });

  describe("clearText", function() {
    it("should function exist", function() {
      const actual = typeof quickPick.clearText;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should vscode.quickPick.value property be set to empty", function() {
      quickPick.clearText();

      const actual = quickPickAny.quickPick.value;
      const expected = "";
      assert.equal(actual, expected);
    });
  });

  describe("submit", function() {
    it("should function exist", function() {
      const actual = typeof quickPickAny.submit;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should callback be called with quick pick argument if qpItem is defined", function() {
      const qpItem: QuickPickExtendedItem = mock.qpItem;
      quickPickAny.submit(qpItem, onQuickPickSubmitCallback);

      const actual = onQuickPickSubmitCallback.calledWith(qpItem);
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should callback be called with string argument if qpItem is undefined", function() {
      quickPickAny.quickPick.value = "test";
      quickPickAny.submit(undefined, onQuickPickSubmitCallback);

      const actual = onQuickPickSubmitCallback.calledWith("test");
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("onDidAccept", function() {
    it("should function exist", function() {
      const actual = typeof quickPickAny.onDidAccept;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should have selected item", function() {
      const submitStub = sinon.stub(quickPickAny, "submit");
      const qpItem: QuickPickExtendedItem = mock.qpItem;
      quickPickAny.quickPick.selectedItems[0] = qpItem;
      quickPickAny.onDidAccept(onQuickPickSubmitCallback);

      const actual = submitStub.calledWith(qpItem, onQuickPickSubmitCallback);
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("onDidChangeValueClearing", function() {
    it("should function exist", function() {
      const actual = typeof quickPickAny.onDidChangeValueClearing;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should quick pick items be cleared", function() {
      quickPickAny.onDidChangeValueClearing();
      const actual: QuickPickExtendedItem[] = quickPickAny.quickPick.items;
      const expected: QuickPickExtendedItem[] = [];
      assert.deepEqual(actual, expected);
    });
  });

  describe("onDidChangeValue", function() {
    it("should function exist", function() {
      const actual = typeof quickPickAny.onDidChangeValue;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should contain items matching the search query", function() {
      const searchQuery = "test";
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      quickPickAny.items = qpItems;
      quickPickAny.onDidChangeValue(searchQuery);

      const actual = quickPickAny.quickPick.items.length;
      const expected = 2;
      assert.deepEqual(actual, expected);
    });
  });
});
