import * as vscode from 'vscode';
import { assert } from "chai";
import * as sinon from "sinon";
import * as utils from "../../utils";
import QuickPickExtendedItem from "../../interfaces/QuickPickExtendedItem";
import Item from "../../interfaces/Item";
import ItemType from "../../enums/ItemType";
import { config } from "../../config";

describe("Utils", function () {
  describe("isValueStringType", function () {
    it("should function exist", function () {
      const actual = typeof (utils.isValueStringType);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return true if value is a string", function () {
      const actual = utils.isValueStringType("aaa");
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should return false if value is not a string", function () {
      const qpItem: QuickPickExtendedItem = { label: "test-label", url: "#", type: ItemType.Directory, breadcrumbs: [] };

      const actual = utils.isValueStringType(qpItem);
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe("isValueFileType", function () {
    it("should function exist", function () {
      const actual = typeof (utils.isValueFileType);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return true if value type is file", function () {
      const qpItem: QuickPickExtendedItem = { label: "test-label", url: "#", type: ItemType.File, breadcrumbs: [] };

      const actual = utils.isValueFileType(qpItem);
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should return false if value type is directory", function () {
      const qpItem: QuickPickExtendedItem = { label: "test-label", url: "#", type: ItemType.Directory, breadcrumbs: [] };

      const actual = utils.isValueFileType(qpItem);
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe("getSearchUrl", function () {
    it("should function exist", function () {
      const actual = typeof (utils.getSearchUrl);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return search url with query string", function () {
      sinon.stub(config, "searchUrl").value("https://developer.mozilla.org/en-US/search");

      const actual = utils.getSearchUrl("string includes 123");
      const expected = "https://developer.mozilla.org/en-US/search?q=string+includes+123";
      assert.equal(actual, expected);
      sinon.restore();
    });

    it("should return search url without query string", function () {
      sinon.stub(config, "searchUrl").value("https://developer.mozilla.org/en-US/search");

      const actual = utils.getSearchUrl("");
      const expected = "https://developer.mozilla.org/en-US/search?q=";
      assert.equal(actual, expected);
      sinon.restore();
    });
  });

  describe("getNameFromQuickPickItem", function () {
    it("should function exist", function () {
      const actual = typeof (utils.getNameFromQuickPickItem);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return name from label without first category", function () {
      const qpItem: QuickPickExtendedItem = { label: "api test-label sub-label", url: "#", type: ItemType.File, breadcrumbs: [] };

      const actual = utils.getNameFromQuickPickItem(qpItem);
      const expected = "test-label sub-label";
      assert.equal(actual, expected);
    });

    it("should return empty name", function () {
      const qpItem: QuickPickExtendedItem = { label: "", url: "#", type: ItemType.File, breadcrumbs: [] };

      const actual = utils.getNameFromQuickPickItem(qpItem);
      const expected = "";
      assert.equal(actual, expected);
    });
  });

  describe("removeDataWithEmptyUrl", function () {
    it("should function exist", function () {
      const actual = typeof (utils.removeDataWithEmptyUrl);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return name from label without first category", function () {
      const qpItems: QuickPickExtendedItem[] = [
        { label: "api test-label sub-label", url: "#", type: ItemType.File, breadcrumbs: [] },
        { label: "api test-label sub-label 2", url: "", type: ItemType.File, breadcrumbs: [] },
        { label: "api test-label sub-label 3", url: "#", type: ItemType.File, breadcrumbs: [] },
      ];
      const actual = utils.removeDataWithEmptyUrl(qpItems).length;
      const expected = 2;
      assert.equal(actual, expected);
    });
  });

  describe("prepareBreadcrumbs", function () {
    it("should function exist", function () {
      const actual = typeof (utils.prepareBreadcrumbs);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return breadcrumbs string with dash if isFlat is falsy", function () {
      const item: Item = { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] };

      const actual = utils.prepareBreadcrumbs(item);
      const expected = "api / test-label";
      assert.equal(actual, expected);
    });

    it("should return empty breadcrumbs string with dash if isFlat is falsy", function () {
      const item: Item = { name: "", url: "#", type: ItemType.File, breadcrumbs: [""] };

      const actual = utils.prepareBreadcrumbs(item);
      const expected = "";
      assert.equal(actual, expected);
    });

    it("should return breadcrumbs string without dash if isFlat is truthy", function () {
      const item: Item = { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] };

      const actual = utils.prepareBreadcrumbs(item, true);
      const expected = "api test-label sub-label";
      assert.equal(actual, expected);
    });
  });

  describe("mapDataToQpData", function () {
    it("should function exist", function () {
      const actual = typeof (utils.mapDataToQpData);
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return array of QuickPickExtendedItem if isFlat is falsy", function () {
      const items: Item[] = [
        { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] },
        { name: "sub-label 2", url: "https://sub-label-2.com", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label 2"] }
      ];

      const actual = utils.mapDataToQpData(items);
      const expectedLength = 2;
      const expectedSecondItem: QuickPickExtendedItem = {
        label: `$(link) sub-label 2`,
        url: "https://sub-label-2.com",
        type: ItemType.File,
        parent: undefined,
        rootParent: undefined,
        breadcrumbs: ["api", "test-label", "sub-label 2"],
        description: undefined,
      };
      assert.equal(actual.length, expectedLength);
      assert.deepEqual(actual[1], expectedSecondItem);
    });

    it("should return array of QuickPickExtendedItem if isFlat is truthy", function () {
      const items: Item[] = [
        { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] },
        { name: "sub-label 2", url: "https://sub-label-2.com", type: ItemType.Directory, breadcrumbs: ["api", "test-label", "sub-label 2"] }
      ];

      const actual = utils.mapDataToQpData(items, true);
      const expectedLength = 2;
      const expectedSecondItem: QuickPickExtendedItem = {
        label: `$(file-directory) sub-label 2`,
        url: "https://sub-label-2.com",
        type: ItemType.Directory,
        parent: undefined,
        rootParent: undefined,
        breadcrumbs: ["api", "test-label", "sub-label 2"],
        description: "api test-label sub-label 2",
      };
      assert.equal(actual.length, expectedLength);
      assert.deepEqual(actual[1], expectedSecondItem);
    });

    describe("mapQpItemToItem", function () {
      it("should function exist", function () {
        const actual = typeof (utils.mapQpItemToItem);
        const expected = "function";
        assert.equal(actual, expected);
      });

      it("should return Item object", function () {
        const qpItem: QuickPickExtendedItem = { label: "api test-label sub-label", url: "#", type: ItemType.File, breadcrumbs: [] };
        const actual = utils.mapQpItemToItem(qpItem);
        const expected: Item = {
          name: "test-label sub-label",
          url: "#",
          parent: undefined,
          rootParent: undefined,
          type: ItemType.File,
          breadcrumbs: [],
        };

        assert.deepEqual(actual, expected);
      });
    });

    describe("addBackwardNavigationItem", function () {
      it("should function exist", function () {
        const actual = typeof (utils.addBackwardNavigationItem);
        const expected = "function";
        assert.equal(actual, expected);
      });

      it("should add backward navigation Item", function () {
        const qpItems: QuickPickExtendedItem[] = [
          { label: "api test-label sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] },
          { label: "api test-label sub-label 2", url: "#", type: ItemType.File, breadcrumbs: [] }
        ];
        utils.addBackwardNavigationItem(qpItems);
        const expectedLength = 3;
        const expectedFirstItem: QuickPickExtendedItem = {
          label: "$(file-directory) ..",
          url: "#",
          type: ItemType.Directory,
          breadcrumbs: [],
          description: "api / test-label"
        };

        assert.equal(qpItems.length, expectedLength);
        assert.deepEqual(qpItems[0], expectedFirstItem);
      });
    });

    describe("prepareQpData", function () {
      let items: Item[];
      before(function () {
        items = [
          { name: "sub-label", url: "#", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label"] },
          { name: "sub-label 2", url: "https://sub-label-2.com", type: ItemType.File, breadcrumbs: ["api", "test-label", "sub-label 2"] }
        ]
      });

      it("should function exist", function () {
        const actual = typeof (utils.prepareQpData);
        const expected = "function";
        assert.equal(actual, expected);
      });

      it("should return array of QuickPickExtendedItem if isFlat is falsy", function () {
        sinon.stub(vscode.workspace, "getConfiguration").returns({
          get: (key: string) => key === "goToMDN.shouldDisplayFlatList" ? false : undefined,
          has: () => true,
          inspect: () => undefined,
          update: () => Promise.resolve(),
        });

        const actual = utils.prepareQpData(items);
        const expectedLength = 3;
        const expectedSecondItem: QuickPickExtendedItem = {
          label: `$(link) sub-label`,
          url: "#",
          type: ItemType.File,
          parent: undefined,
          rootParent: undefined,
          breadcrumbs: ["api", "test-label", "sub-label"],
          description: undefined,
        };

        assert.equal(actual.length, expectedLength);
        assert.deepEqual(actual[1], expectedSecondItem);
        sinon.restore();
      });

      it("should return array of QuickPickExtendedItem if isFlat is true", function () {
        sinon.stub(utils, "shouldDisplayFlatList").returns(true);

        const actual = utils.prepareQpData(items);
        const expectedLength = 2;
        const expectedSecondItem: QuickPickExtendedItem = {
          label: `$(link) sub-label 2`,
          url: "https://sub-label-2.com",
          type: ItemType.File,
          parent: undefined,
          rootParent: undefined,
          breadcrumbs: ["api", "test-label", "sub-label 2"],
          description: "api test-label sub-label 2",
        };

        assert.equal(actual.length, expectedLength);
        assert.deepEqual(actual[1], expectedSecondItem);
        sinon.restore();
      });
    });

    describe("getConfiguration", function () {
      it("should function exist", function () {
        const actual = typeof (utils.getConfiguration);
        const expected = "function";
        assert.equal(actual, expected);
      });

      it("should return true for goToMDN.shouldDisplayFlatList key", function () {
        sinon.stub(vscode.workspace, "getConfiguration").returns({
          get: (key: string) => key === "goToMDN.shouldDisplayFlatList" ? true : undefined,
          has: () => true,
          inspect: () => undefined,
          update: () => Promise.resolve(),
        });

        const actual = utils.getConfiguration("goToMDN.shouldDisplayFlatList", false);
        const expected = true;
        assert.equal(actual, expected);
        sinon.restore();
      });
    });

    describe("shouldDisplayFlatList", function () {
      it("should function exist", function () {
        const actual = typeof (utils.shouldDisplayFlatList);
        const expected = "function";
        assert.equal(actual, expected);
      });

      it("should return true", function () {
        sinon.stub(utils, "getConfiguration").returns(true);

        const actual = utils.shouldDisplayFlatList();
        const expected = true;
        assert.equal(actual, expected);
        sinon.restore();
      });
    });

    describe("getToken", function () {
      it("should function exist", function () {
        const actual = typeof (utils.getToken);
        const expected = "function";
        assert.equal(actual, expected);
      });

      it("should return sample token", function () {
        sinon.stub(utils, "getConfiguration").returns("sample token");

        const actual = utils.getToken();
        const expected = "sample token";
        assert.equal(actual, expected);
        sinon.restore();
      });
    });
  });
});
