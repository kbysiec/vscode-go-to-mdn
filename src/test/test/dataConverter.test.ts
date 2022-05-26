import { assert } from "chai";
import * as dataConverter from "../../dataConverter";
import Item from "../../interface/Item";
import QuickPickItem from "../../interface/QuickPickItem";
import * as mock from "../mock/dataConverter.mock";
import { getTestSetups } from "../testSetup/dataConverter.testSetup";

// const ProxiedDataConverter = proxyquire("../../dataConverter", {
//   getNameFromQuickPickItem: sinon.stub(),
//   shouldDisplayFlatList: sinon.stub(),
// }).default;

describe("DataConverter", () => {
  let setups = getTestSetups();

  beforeEach(() => {
    setups = getTestSetups();
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
