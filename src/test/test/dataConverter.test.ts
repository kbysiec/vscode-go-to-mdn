import { assert } from "chai";
import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import Config from "../../config";
import DataConverter from "../../dataConverter";
import Item from "../../interface/Item";
import QuickPickItem from "../../interface/QuickPickItem";
import * as mock from "../mock/dataConverter.mock";
import { getTestSetups } from "../testSetup/dataConverter.testSetup";
import { getConfigStub } from "../util/mockFactory";

const ProxiedDataConverter = proxyquire("../../dataConverter", {
  getNameFromQuickPickItem: sinon.stub(),
}).default;

describe("DataConverter", () => {
  let configStub: Config = getConfigStub();
  let dataConverter: DataConverter = new ProxiedDataConverter(configStub);
  let setups = getTestSetups(dataConverter);

  beforeEach(() => {
    configStub = getConfigStub();
    dataConverter = new ProxiedDataConverter(configStub);
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
