import { assert } from "chai";
import * as dataConverter from "../../dataConverter";
import QuickPickItem from "../../interface/QuickPickItem";
import * as mock from "../mock/dataConverter.mock";
import { getTestSetups } from "../testSetup/dataConverter.testSetup";

type SetupsType = ReturnType<typeof getTestSetups>;

describe("DataConverter", () => {
  let setups: SetupsType;

  before(() => {
    setups = getTestSetups();
  });
  afterEach(() => setups.afterEach());

  describe("prepareQpData", () => {
    it("1: should return array of QuickPickItem", () => {
      const expectedSecondItem: QuickPickItem = setups.prepareQpData1();
      const actual = dataConverter.prepareQpData(mock.items);
      const expectedLength = 2;

      assert.equal(actual.length, expectedLength);
      assert.deepEqual(actual[1], expectedSecondItem);
    });
  });
});
