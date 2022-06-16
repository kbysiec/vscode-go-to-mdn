import { assert } from "chai";
import * as parser from "../../parser";
import * as mock from "../mock/parser.mock";
import { getTestSetups } from "../testSetup/parser.testSetup";

type SetupsType = ReturnType<typeof getTestSetups>;

describe("Parser", () => {
  let setups: SetupsType;

  before(() => {
    setups = getTestSetups();
  });

  describe("parseData", () => {
    it("1: should return array of Item elements", () => {
      const expected = setups.parseData1();
      const actual = parser.parseData(mock.itemsInput);
      assert.deepEqual(actual, expected);
    });

    it("2: should return empty array", () => {
      assert.deepEqual(parser.parseData({}), []);
    });
  });
});
