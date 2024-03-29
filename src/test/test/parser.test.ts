import { assert } from "chai";
import * as parser from "../../parser";
import * as mock from "../mocks";

describe("Parser", () => {
  describe("parseData", () => {
    it("1: should return array of Item elements", () => {
      const actual = parser.parseData(mock.parserInput);
      assert.deepEqual(actual, mock.inputData);
    });

    it("2: should return empty array", () => {
      assert.deepEqual(parser.parseData({}), mock.emptyInputData);
    });

    it("3: should remove redundant json properties", () => {
      assert.deepEqual(parser.parseData(mock.parserInput), mock.inputData);
    });
  });
});
