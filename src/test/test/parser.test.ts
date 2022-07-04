import { assert } from "chai";
import * as parser from "../../parser";
import * as mock from "../mock/mocks";

describe("Parser", () => {
  describe("parseData", () => {
    it("1: should return array of Item elements", () => {
      const actual = parser.parseData(mock.parserInput);
      assert.deepEqual(actual, mock.outputData);
    });

    it("2: should return empty array", () => {
      assert.deepEqual(parser.parseData({}), mock.emptyOutputData);
    });
  });
});
