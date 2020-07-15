import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import Utils from "../../utils";
import QuickPickItem from "../../interfaces/QuickPickItem";
import Item from "../../interfaces/Item";
import ItemType from "../../enums/ItemType";
import * as mock from "../mocks/dataConverter.mock";
import { getUtilsStub } from "../util/mockFactory";
import DataConverter from "../../dataConverter";

describe("DataConverter", () => {
  let utilsStub: Utils;
  let dataConverter: DataConverter;
  let dataConverterAny: any;

  before(() => {
    utilsStub = getUtilsStub();
    dataConverter = new DataConverter(utilsStub);
    dataConverterAny = dataConverter as any;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("prepareQpData", () => {
    it("should return array of QuickPickItem if isFlat is falsy", () => {
      sinon.stub(vscode.workspace, "getConfiguration").returns({
        get: (key: string) =>
          key === "goToMDN.shouldDisplayFlatList" ? false : undefined,
        has: () => true,
        inspect: () => undefined,
        update: () => Promise.resolve(),
      });
      const items: Item[] = mock.items;

      const actual = dataConverter.prepareQpData(items);
      const expectedLength = 3;
      const expectedSecondItem: QuickPickItem = {
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

    it("should return array of QuickPickItem if isFlat is true", () => {
      sinon.stub(dataConverterAny.utils, "shouldDisplayFlatList").returns(true);
      const items: Item[] = mock.items;

      const actual = dataConverter.prepareQpData(items);
      const expectedLength = 2;
      const expectedSecondItem: QuickPickItem = {
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

  describe("mapQpItemToItem", () => {
    it("should return Item object", () => {
      const qpItem: QuickPickItem = mock.qpItemFile;

      const actual = dataConverter.mapQpItemToItem(qpItem);
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

  describe("mapDataToQpData", () => {
    it("should return array of QuickPickItem if isFlat is falsy", () => {
      const items: Item[] = mock.itemsMixedFileType;

      const actual = dataConverterAny.mapDataToQpData(items);
      const expectedLength = 2;
      const expectedSecondItem: QuickPickItem = {
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

    it("should return array of QuickPickItem if isFlat is truthy", () => {
      const items: Item[] = mock.items;

      const actual = dataConverterAny.mapDataToQpData(items, true);
      const expectedLength = 2;
      const expectedSecondItem: QuickPickItem = {
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

  describe("addBackwardNavigationItem", () => {
    it("should add backward navigation Item", () => {
      const qpItems: QuickPickItem[] = mock.qpItems;
      dataConverterAny.addBackwardNavigationItem(qpItems);
      const expectedLength = 4;
      const expectedFirstItem: QuickPickItem = {
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

  describe("prepareBreadcrumbs", () => {
    it("should return breadcrumbs string with dash if isFlat is falsy", () => {
      const item: Item = mock.item;

      const actual = dataConverterAny.prepareBreadcrumbs(item);
      const expected = "api / test-label";
      assert.equal(actual, expected);
    });

    it("should return empty breadcrumbs string with dash if isFlat is falsy", () => {
      const item: Item = mock.itemEmptyName;

      const actual = dataConverterAny.prepareBreadcrumbs(item);
      const expected = "";
      assert.equal(actual, expected);
    });

    it("should return breadcrumbs string without dash if isFlat is truthy", () => {
      const item: Item = mock.item;

      const actual = dataConverterAny.prepareBreadcrumbs(item, true);
      const expected = "api test-label sub-label";
      assert.equal(actual, expected);
    });
  });
});
