import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import Utils from "../../utils";
import QuickPickExtendedItem from "../../interfaces/QuickPickExtendedItem";
import Item from "../../interfaces/Item";
import ItemType from "../../enums/ItemType";
import { appConfig } from "../../appConfig";
import * as mock from "../mocks/utils.mock";

describe("Utils", () => {
  let utils: Utils;
  let utilsAny: any;

  before(() => {
    utils = new Utils();
    utilsAny = utils as any;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("isValueStringType", () => {
    it("should return true if value is a string", () => {
      const actual = utils.isValueStringType("test");
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should return false if value is not a string", () => {
      const qpItem: QuickPickExtendedItem = mock.qpItemFile;

      const actual = utils.isValueStringType(qpItem);
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe("isValueFileType", () => {
    it("should return true if value type is file", () => {
      const qpItem: QuickPickExtendedItem = mock.qpItemFile;

      const actual = utils.isValueFileType(qpItem);
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should return false if value type is directory", () => {
      const qpItem: QuickPickExtendedItem = mock.qpItemDirectory;

      const actual = utils.isValueFileType(qpItem);
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe("getSearchUrl", () => {
    it("should return search url with query string", () => {
      const baseUrl = "https://developer.mozilla.org/en-US/search";
      sinon.stub(appConfig, "searchUrl").value(baseUrl);

      const actual = utils.getSearchUrl("string includes 123");
      const expected = `${baseUrl}?q=string+includes+123`;
      assert.equal(actual, expected);
    });

    it("should return search url without query string", () => {
      const baseUrl = "https://developer.mozilla.org/en-US/search";
      sinon.stub(appConfig, "searchUrl").value(baseUrl);

      const actual = utils.getSearchUrl("");
      const expected = `${baseUrl}?q=`;
      assert.equal(actual, expected);
    });
  });

  describe("getNameFromQuickPickItem", () => {
    it("should return name from label without first category", () => {
      const qpItem: QuickPickExtendedItem = mock.qpItemFile;

      const actual = utils.getNameFromQuickPickItem(qpItem);
      const expected = "test-label sub-label";
      assert.equal(actual, expected);
    });

    it("should return empty name", () => {
      const qpItem: QuickPickExtendedItem = mock.qpItemEmptyLabel;

      const actual = utils.getNameFromQuickPickItem(qpItem);
      const expected = "";
      assert.equal(actual, expected);
    });
  });

  describe("removeDataWithEmptyUrl", () => {
    it("should return name from label without first category", () => {
      const qpItems: QuickPickExtendedItem[] = mock.qpItems;
      const actual = utils.removeDataWithEmptyUrl(qpItems).length;
      const expected = 2;
      assert.equal(actual, expected);
    });
  });

  describe("prepareBreadcrumbs", () => {
    it("should return breadcrumbs string with dash if isFlat is falsy", () => {
      const item: Item = mock.item;

      const actual = utils.prepareBreadcrumbs(item);
      const expected = "api / test-label";
      assert.equal(actual, expected);
    });

    it("should return empty breadcrumbs string with dash if isFlat is falsy", () => {
      const item: Item = mock.itemEmptyName;

      const actual = utils.prepareBreadcrumbs(item);
      const expected = "";
      assert.equal(actual, expected);
    });

    it("should return breadcrumbs string without dash if isFlat is truthy", () => {
      const item: Item = mock.item;

      const actual = utils.prepareBreadcrumbs(item, true);
      const expected = "api test-label sub-label";
      assert.equal(actual, expected);
    });
  });

  describe("mapDataToQpData", () => {
    it("should return array of QuickPickExtendedItem if isFlat is falsy", () => {
      const items: Item[] = mock.itemsMixedFileType;

      const actual = utils.mapDataToQpData(items);
      const expectedLength = 2;
      const expectedSecondItem: QuickPickExtendedItem = {
        label: `$(file-directory) sub-label 2`,
        url: "https://sub-label-2.com",
        type: ItemType.Directory,
        parent: undefined,
        rootParent: undefined,
        breadcrumbs: ["api", "test-label", "sub-label 2"],
        description: undefined,
      };
      assert.equal(actual.length, expectedLength);
      assert.deepEqual(actual[1], expectedSecondItem);
    });

    it("should return array of QuickPickExtendedItem if isFlat is truthy", () => {
      const items: Item[] = mock.items;

      const actual = utils.mapDataToQpData(items, true);
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
    });

    describe("mapQpItemToItem", () => {
      it("should return Item object", () => {
        const qpItem: QuickPickExtendedItem = mock.qpItemFile;

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

    describe("addBackwardNavigationItem", () => {
      it("should add backward navigation Item", () => {
        const qpItems: QuickPickExtendedItem[] = mock.qpItems;
        utils.addBackwardNavigationItem(qpItems);
        const expectedLength = 4;
        const expectedFirstItem: QuickPickExtendedItem = {
          label: "$(file-directory) ..",
          url: "#",
          type: ItemType.Directory,
          breadcrumbs: [],
          description: "api / test-label",
        };

        assert.equal(qpItems.length, expectedLength);
        assert.deepEqual(qpItems[0], expectedFirstItem);
      });
    });

    describe("prepareQpData", () => {
      it("should return array of QuickPickExtendedItem if isFlat is falsy", () => {
        sinon.stub(vscode.workspace, "getConfiguration").returns({
          get: (key: string) =>
            key === "goToMDN.shouldDisplayFlatList" ? false : undefined,
          has: () => true,
          inspect: () => undefined,
          update: () => Promise.resolve(),
        });
        const items: Item[] = mock.items;

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
      });

      it("should return array of QuickPickExtendedItem if isFlat is true", () => {
        sinon.stub(utils, "shouldDisplayFlatList").returns(true);
        const items: Item[] = mock.items;

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
      });
    });

    describe("getConfiguration", () => {
      it("should return true for goToMDN.shouldDisplayFlatList key", () => {
        sinon.stub(vscode.workspace, "getConfiguration").returns({
          get: (key: string) =>
            key === "goToMDN.shouldDisplayFlatList" ? true : undefined,
          has: () => true,
          inspect: () => undefined,
          update: () => Promise.resolve(),
        });

        const actual = utils.getConfiguration(
          "goToMDN.shouldDisplayFlatList",
          false
        );
        const expected = true;
        assert.equal(actual, expected);
      });
    });

    describe("shouldDisplayFlatList", () => {
      it("should return true", () => {
        sinon.stub(utils, "getConfiguration").returns(true);

        const actual = utils.shouldDisplayFlatList();
        const expected = true;
        assert.equal(actual, expected);
      });
    });

    describe("getToken", () => {
      it("should return sample token", () => {
        sinon.stub(utils, "getConfiguration").returns("sample token");

        const actual = utils.getToken();
        const expected = "sample token";
        assert.equal(actual, expected);
      });
    });
  });
});
