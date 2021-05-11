import ItemType from "../../enum/itemType";
import Item from "../../interface/item";
import Parser from "../../parser";
import * as mock from "../mock/parser.mock";

export const getTestSetups = () => {
  return {
    parseFlatElements1: () => {
      const expected: Item[] = [
        {
          name: "sub-label",
          url: "#",
          parent: {
            name: "elements",
            url: "https://api.github.com/repos/mdn/browser-compat-data/contents/svg/elements?ref=main",
            type: ItemType.Directory,
            parent: undefined,
            rootParent: undefined,
            breadcrumbs: ["svg", "elements"],
          },
          rootParent: undefined,
          type: ItemType.File,
          breadcrumbs: ["api", "test-label", "sub-label"],
        },
        {
          name: "sub-label 2",
          url: "https://sub-label-2.com",
          parent: undefined,
          rootParent: undefined,
          type: ItemType.File,
          breadcrumbs: ["api", "test-label", "sub-label 2"],
        },
      ];

      return expected;
    },
    parseElements1: () => {
      const expected: Item[] = [
        {
          name: "animate Color - reference",
          url: "https://developer.mozilla.org/docs/Web/SVG/Element/animateColor",
          type: ItemType.File,
          parent: mock.parseElementsItem,
          rootParent: undefined,
          breadcrumbs: ["svg", "elements", "animate Color", "animate Color"],
        },
        {
          name: "by",
          url: "",
          type: ItemType.File,
          parent: mock.parseElementsItem,
          rootParent: undefined,
          breadcrumbs: ["svg", "elements", "animate Color", "by"],
        },
      ];

      return expected;
    },
    parseElements2: () => {
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url: "https://developer.mozilla.org/docs/Web/WebDriver/Commands/AcceptAlert",
          type: ItemType.File,
          parent: mock.parseElementsWithNestingItem,
          rootParent: undefined,
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
          rootParent: undefined,
          breadcrumbs: ["webdriver", "commands", "Accept Alert", "wildcard"],
        },
      ];

      return expected;
    },
    parseElements3: () => {
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url: "",
          type: ItemType.File,
          parent: mock.parseElementsWithEmptyCompatItem,
          rootParent: undefined,
          breadcrumbs: [
            "webdriver",
            "commands",
            "Accept Alert",
            "Accept Alert",
          ],
        },
      ];

      return expected;
    },
    parseElements4: () => {
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url: "",
          type: ItemType.File,
          parent: mock.parseElementsWithNoCompatItem,
          rootParent: undefined,
          breadcrumbs: [
            "webdriver",
            "commands",
            "Accept Alert",
            "Accept Alert",
          ],
        },
      ];

      return expected;
    },
    parseDirectories1: () => {
      const expected: Item[] = [
        {
          name: "Abort Controller",
          url: "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortController.json?ref=main",
          type: ItemType.Directory,
          parent: mock.parseDirectoriesItem,
          rootParent: mock.parseDirectoriesItem,
          breadcrumbs: ["api", "Abort Controller"],
        },
        {
          name: "Abort Payment Event",
          url: "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortPaymentEvent.json?ref=main",
          type: ItemType.Directory,
          parent: mock.parseDirectoriesItem,
          rootParent: mock.parseDirectoriesItem,
          breadcrumbs: ["api", "Abort Payment Event"],
        },
      ];

      return expected;
    },
  };
};
