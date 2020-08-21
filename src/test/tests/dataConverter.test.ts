import { assert } from "chai";
import Config from "../../config";
import QuickPickItem from "../../interfaces/QuickPickItem";
import Item from "../../interfaces/Item";
import ItemType from "../../enums/ItemType";
import * as mock from "../mocks/dataConverter.mock";
import { getConfigStub, getUtilsStub } from "../util/mockFactory";
import DataConverter from "../../dataConverter";
import Utils from "../../utils";
import { stubMultiple, restoreStubbedMultiple } from "../util/stubUtils";

describe("DataConverter", () => {
  let configStub: Config;
  let utilsStub: Utils;
  let dataConverter: DataConverter;
  let dataConverterAny: any;

  beforeEach(() => {
    configStub = getConfigStub();
    utilsStub = getUtilsStub();
    dataConverter = new DataConverter(configStub, utilsStub);
    dataConverterAny = dataConverter as any;
  });

  describe("prepareQpData", () => {
    it(`should return array of QuickPickItem if isFlat is falsy
      and one of items is a directory`, () => {
      restoreStubbedMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
        },
      ]);

      stubMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
      ]);

      const actual = dataConverter.prepareQpData(mock.items);
      const expectedLength = 3;
      const expectedSecondItem: QuickPickItem = {
        label: `$(file-directory) sub-label`,
        url: "#",
        type: ItemType.Directory,
        parent: undefined,
        rootParent: undefined,
        breadcrumbs: ["api", "test-label", "sub-label"],
        description: undefined,
      };

      assert.equal(actual.length, expectedLength);
      assert.deepEqual(actual[1], expectedSecondItem);
    });

    it("should return array of QuickPickItem if isFlat is true", () => {
      restoreStubbedMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
        },
      ]);

      stubMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
      ]);

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
      restoreStubbedMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
        },
        {
          object: dataConverterAny.utils,
          method: "getNameFromQuickPickItem",
        },
      ]);

      stubMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
      ]);

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
});
