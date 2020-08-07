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
      const inputData: any = mock.flatElementsInput;

      const actual = parser.parseFlatElements(inputData);
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
      const actual = parser.parseFlatElements({});
      const expected: Item[] = [];
      assert.deepEqual(actual, expected);
    });
  });

  describe("parseRootDirectories", () => {
    it("should return array of Item elements once content contains has links", () => {
      const content: string = mock.rootDirectoriesWithLinks;

      const actual = parser.parseRootDirectories(content);
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
      const content: string = mock.rootDirectoriesNoLink;

      const actual = parser.parseRootDirectories(content);
      const expected: Item[] = [];
      assert.deepEqual(actual, expected);
    });
  });

  describe("parseElements", () => {
    it("should return array of Item elements if content is array of files without unnecessary nesting of keys", () => {
      const content: string = mock.parseElementsContent;
      const item: Item = mock.parseElementsItem;

      const actual = parser.parseElements(content, item);
      const expected: Item[] = [
        {
          name: "animate Color - reference",
          url:
            "https://developer.mozilla.org/docs/Web/SVG/Element/animateColor",
          type: ItemType.File,
          parent: item,
          breadcrumbs: ["svg", "elements", "animate Color", "animate Color"],
        },
        {
          name: "by",
          url: "",
          type: ItemType.File,
          parent: item,
          breadcrumbs: ["svg", "elements", "animate Color", "by"],
        },
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return array of Item elements if content is array of files with unnecessary nesting of keys", () => {
      const content: string = mock.parseElementsWithNestingContent;
      const item: Item = mock.parseElementsWithNestingItem;

      const actual = parser.parseElements(content, item);
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url:
            "https://developer.mozilla.org/docs/Web/WebDriver/Commands/AcceptAlert",
          type: ItemType.File,
          parent: item,
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
          parent: item,
          breadcrumbs: ["webdriver", "commands", "Accept Alert", "wildcard"],
        },
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return array of 1 Item element if content contains object with empty __compat property", () => {
      const content: string = mock.parseElementsWithEmptyCompatContent;
      const item: Item = mock.parseElementsWithEmptyCompatItem;

      const actual = parser.parseElements(content, item);
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url: "",
          type: ItemType.File,
          parent: item,
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
      const content: string = mock.parseElementsWithNoCompatContent;
      const item: Item = mock.parseElementsWithNoCompatItem;

      const actual = parser.parseElements(content, item);
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url: "",
          type: ItemType.File,
          parent: item,
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
      const content: string = mock.parseElementsContent;
      const item: Item = mock.parseElementsItemNoParent;

      const actual = parser.parseElements(content, item);
      const expected: Item[] = [];

      assert.deepEqual(actual, expected);
    });
  });

  describe("parseDirectories", () => {
    it("should return array of Item elements if content is array of directories", () => {
      const item: Item = mock.parseDirectoriesItem;
      const content: Array<any> = mock.parseDirectoriesContent;

      const actual = parser.parseDirectories(content, item);
      const expected: Item[] = [
        {
          name: "Abort Controller",
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortController.json?ref=master",
          type: ItemType.Directory,
          parent: item,
          rootParent: item,
          breadcrumbs: ["api", "Abort Controller"],
        },
        {
          name: "Abort Payment Event",
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortPaymentEvent.json?ref=master",
          type: ItemType.Directory,
          parent: item,
          rootParent: item,
          breadcrumbs: ["api", "Abort Payment Event"],
        },
      ];

      assert.deepEqual(actual, expected);
    });
  });
});
