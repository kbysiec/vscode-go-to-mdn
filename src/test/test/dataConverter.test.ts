import { assert } from "chai";
import Config from "../../config";
import QuickPickItem from "../../interface/QuickPickItem";
import Item from "../../interface/Item";
import * as mock from "../mock/dataConverter.mock";
import { getConfigStub, getUtilsStub } from "../util/mockFactory";
import DataConverter from "../../dataConverter";
import Utils from "../../utils";
import { getTestSetups } from "../testSetup/dataConverter.testSetup";

describe("DataConverter", () => {
  let configStub: Config = getConfigStub();
  let utilsStub: Utils = getUtilsStub();
  let dataConverter: DataConverter = new DataConverter(configStub, utilsStub);
  let setups = getTestSetups(dataConverter);

  beforeEach(() => {
    configStub = getConfigStub();
    utilsStub = getUtilsStub();
    dataConverter = new DataConverter(configStub, utilsStub);
    setups = getTestSetups(dataConverter);
  });

  describe("prepareQpData", () => {
    it(`1: should return array of QuickPickItem if isFlat is falsy
      and one of items is a directory`, () => {
      const expectedSecondItem: QuickPickItem = setups.prepareQpData1();
      const actual = dataConverter.prepareQpData(mock.items);
      const expectedLength = 3;

      assert.equal(actual.length, expectedLength);
      assert.deepEqual(actual[1], expectedSecondItem);
    });

    it("2: should return array of QuickPickItem if isFlat is true", () => {
      const expectedSecondItem: QuickPickItem = setups.prepareQpData2();
      const actual = dataConverter.prepareQpData(mock.items);
      const expectedLength = 2;

      assert.equal(actual.length, expectedLength);
      assert.deepEqual(actual[1], expectedSecondItem);
    });
  });

  describe("mapQpItemToItem", () => {
    it("1: should return Item object", () => {
      const expected: Item = setups.mapQpItemToItem1();
      const actual = dataConverter.mapQpItemToItem(mock.qpItemFile);

      assert.deepEqual(actual, expected);
    });
  });
});
