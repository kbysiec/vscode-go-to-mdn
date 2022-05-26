import { assert } from "chai";
import * as parser from "../../parser";
import * as mock from "../mock/parser.mock";
import { getTestSetups } from "../testSetup/parser.testSetup";

describe("Parser", () => {
  let setups = getTestSetups();

  beforeEach(() => {
    setups = getTestSetups();
  });

  describe("parseFlatElements", () => {
    it("1: should return array of Item elements", () => {
      const expected = setups.parseFlatElements1();
      const actual = parser.parseFlatElements(mock.flatElementsInput);
      assert.deepEqual(actual, expected);
    });

    it("2: should return empty array", () => {
      assert.deepEqual(parser.parseFlatElements({}), []);
    });
  });

  describe("parseRootDirectories", () => {
    it("1: should return array of Item elements once content contains has links", () => {
      assert.deepEqual(
        parser.parseRootDirectories(mock.rootDirectoriesWithLinks),
        mock.directoriesOutputItems
      );
    });

    it("2: should return array of Item elements once content doesn't contain any link", () => {
      assert.deepEqual(
        parser.parseRootDirectories(mock.rootDirectoriesNoLink),
        []
      );
    });
  });

  describe("parseElements", () => {
    it("1: should return array of Item elements if content is array of files without unnecessary nesting of keys", () => {
      const expected = setups.parseElements1();
      const actual = parser.parseElements(
        mock.parseElementsContent,
        mock.parseElementsItem
      );

      assert.deepEqual(actual, expected);
    });

    it("2: should return array of Item elements if content is array of files with unnecessary nesting of keys", () => {
      const expected = setups.parseElements2();
      const actual = parser.parseElements(
        mock.parseElementsWithNestingContent,
        mock.parseElementsWithNestingItem
      );

      assert.deepEqual(actual, expected);
    });

    it("3: should return array of 1 Item element if content contains object with empty __compat property", () => {
      const expected = setups.parseElements3();
      const actual = parser.parseElements(
        mock.parseElementsWithEmptyCompatContent,
        mock.parseElementsWithEmptyCompatItem
      );

      assert.deepEqual(actual, expected);
    });

    it("4: should return array of 1 Item element if content doesn't contain any object with __compat property", () => {
      const expected = setups.parseElements4();
      const actual = parser.parseElements(
        mock.parseElementsWithNoCompatContent,
        mock.parseElementsWithNoCompatItem
      );

      assert.deepEqual(actual, expected);
    });

    it("5: should return empty array if parent element is undefined", () => {
      const actual = parser.parseElements(
        mock.parseElementsContent,
        mock.parseElementsItemNoParent
      );

      assert.deepEqual(actual, []);
    });
  });

  describe("parseDirectories", () => {
    it("1: should return array of Item elements if content is array of directories", () => {
      const expected = setups.parseDirectories1();
      const actual = parser.parseDirectories(
        mock.parseDirectoriesContent,
        mock.parseDirectoriesItem
      );

      assert.deepEqual(actual, expected);
    });
  });
});
