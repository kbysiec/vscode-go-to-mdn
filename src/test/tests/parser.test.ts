import { assert } from "chai";
import Parser from "../../parser";
import Item from "../../interfaces/Item";
import ItemType from "../../enums/ItemType";
import * as mock from "../mocks/parser.mock";

describe("Parser", () => {
  let parser: Parser;

  before(() => {
    parser = new Parser();
  });

  describe("parseFlatElements", () => {
    it("should return array of Item elements", () => {
      const actual = parser.parseFlatElements(mock.flatElementsInput);
      const expected: Item[] = [
        {
          name: "sub-label",
          url: "#",
          parent: {
            name: "elements",
            url:
              "https://api.github.com/repos/mdn/browser-compat-data/contents/svg/elements?ref=master",
            type: ItemType.Directory,
            parent: undefined,
            rootParent: undefined,
            breadcrumbs: ["svg", "elements"],
          },
          type: ItemType.File,
          breadcrumbs: ["api", "test-label", "sub-label"],
        },
        {
          name: "sub-label 2",
          url: "https://sub-label-2.com",
          parent: undefined,
          type: ItemType.File,
          breadcrumbs: ["api", "test-label", "sub-label 2"],
        },
      ];
      assert.deepEqual(actual, expected);
    });

    it("should return empty array", () => {
      assert.deepEqual(parser.parseFlatElements({}), []);
    });
  });

  describe("parseRootDirectories", () => {
    it("should return array of Item elements once content contains has links", () => {
      const actual = parser.parseRootDirectories(mock.rootDirectoriesWithLinks);
      const expected: Item[] = [
        {
          name: "label",
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/label?ref=master",
          type: ItemType.Directory,
          breadcrumbs: ["label"],
        },
        {
          name: "category",
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/category?ref=master",
          type: ItemType.Directory,
          breadcrumbs: ["category"],
        },
      ];
      assert.deepEqual(actual, expected);
    });

    it("should return array of Item elements once content doesn't contain any link", () => {
      assert.deepEqual(
        parser.parseRootDirectories(mock.rootDirectoriesNoLink),
        []
      );
    });
  });

  describe("parseElements", () => {
    it("should return array of Item elements if content is array of files without unnecessary nesting of keys", () => {
      const actual = parser.parseElements(
        mock.parseElementsContent,
        mock.parseElementsItem
      );
      const expected: Item[] = [
        {
          name: "animate Color - reference",
          url:
            "https://developer.mozilla.org/docs/Web/SVG/Element/animateColor",
          type: ItemType.File,
          parent: mock.parseElementsItem,
          breadcrumbs: ["svg", "elements", "animate Color", "animate Color"],
        },
        {
          name: "by",
          url: "",
          type: ItemType.File,
          parent: mock.parseElementsItem,
          breadcrumbs: ["svg", "elements", "animate Color", "by"],
        },
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return array of Item elements if content is array of files with unnecessary nesting of keys", () => {
      const actual = parser.parseElements(
        mock.parseElementsWithNestingContent,
        mock.parseElementsWithNestingItem
      );
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url:
            "https://developer.mozilla.org/docs/Web/WebDriver/Commands/AcceptAlert",
          type: ItemType.File,
          parent: mock.parseElementsWithNestingItem,
          breadcrumbs: [
            "webdriver",
            "commands",
            "Accept Alert",
            "Accept Alert",
          ],
        },
        {
          name: "wildcard",
          url: "",
          type: ItemType.File,
          parent: mock.parseElementsWithNestingItem,
          breadcrumbs: ["webdriver", "commands", "Accept Alert", "wildcard"],
        },
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return array of 1 Item element if content contains object with empty __compat property", () => {
      const actual = parser.parseElements(
        mock.parseElementsWithEmptyCompatContent,
        mock.parseElementsWithEmptyCompatItem
      );
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url: "",
          type: ItemType.File,
          parent: mock.parseElementsWithEmptyCompatItem,
          breadcrumbs: [
            "webdriver",
            "commands",
            "Accept Alert",
            "Accept Alert",
          ],
        },
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return array of 1 Item element if content doesn't contain any object with __compat property", () => {
      const actual = parser.parseElements(
        mock.parseElementsWithNoCompatContent,
        mock.parseElementsWithNoCompatItem
      );
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url: "",
          type: ItemType.File,
          parent: mock.parseElementsWithNoCompatItem,
          breadcrumbs: [
            "webdriver",
            "commands",
            "Accept Alert",
            "Accept Alert",
          ],
        },
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return empty array if parent element is undefined", () => {
      const actual = parser.parseElements(
        mock.parseElementsContent,
        mock.parseElementsItemNoParent
      );
      const expected: Item[] = [];

      assert.deepEqual(actual, expected);
    });
  });

  describe("parseDirectories", () => {
    it("should return array of Item elements if content is array of directories", () => {
      const actual = parser.parseDirectories(
        mock.parseDirectoriesContent,
        mock.parseDirectoriesItem
      );
      const expected: Item[] = [
        {
          name: "Abort Controller",
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortController.json?ref=master",
          type: ItemType.Directory,
          parent: mock.parseDirectoriesItem,
          rootParent: mock.parseDirectoriesItem,
          breadcrumbs: ["api", "Abort Controller"],
        },
        {
          name: "Abort Payment Event",
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortPaymentEvent.json?ref=master",
          type: ItemType.Directory,
          parent: mock.parseDirectoriesItem,
          rootParent: mock.parseDirectoriesItem,
          breadcrumbs: ["api", "Abort Payment Event"],
        },
      ];

      assert.deepEqual(actual, expected);
    });
  });
});
