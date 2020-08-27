import ItemType from "../../enums/itemType";
import Item from "../../interfaces/item";

export const flatElementsInput: any = {
  items: [
    {
      name: "sub-label",
      url: "#",
      breadcrumbs: ["api", "test-label", "sub-label"],
      parent: {
        name: "elements",
        url:
          "https://api.github.com/repos/mdn/browser-compat-data/contents/svg/elements?ref=master",
        type: ItemType.Directory,
        parent: undefined,
        rootParent: undefined,
        breadcrumbs: ["svg", "elements"],
      },
    },
    {
      name: "sub-label 2",
      url: "https://sub-label-2.com",
      breadcrumbs: ["api", "test-label", "sub-label 2"],
    },
  ],
};

export const rootDirectoriesWithLinks: string = `*Please note that we have not (yet) migrated all compatibility data from the MDN wiki pages into this repository.*
- [label/](https://github.com/mdn/browser-compat-data/tree/master/label) contains data for each Web API interface.
- [category/](https://github.com/mdn/browser-compat-data/tree/master/category) contains data for CSS properties, selectors, and at-rules.
[HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) elements, attributes, and global attributes.
## Format of the browser compat json files`;

export const rootDirectoriesNoLink: string = `*Please note that we have not (yet) migrated all compatibility data from the MDN wiki pages into this repository.*
[HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) elements, attributes, and global attributes.
## Format of the browser compat json files`;

export const parseElementsItem: Item = {
  name: "animate Color",
  url:
    "https://api.github.com/repos/mdn/browser-compat-data/contents/svg/elements/animateColor.json?ref=master",
  type: ItemType.Directory,
  parent: {
    name: "elements",
    url:
      "https://api.github.com/repos/mdn/browser-compat-data/contents/svg/elements?ref=master",
    type: ItemType.Directory,
    parent: undefined,
    rootParent: undefined,
    breadcrumbs: ["svg", "elements"],
  },
  rootParent: undefined,
  breadcrumbs: ["svg", "elements", "animate Color"],
};

export const parseElementsItemNoParent: Item = {
  name: "animate Color",
  url:
    "https://api.github.com/repos/mdn/browser-compat-data/contents/svg/elements/animateColor.json?ref=master",
  type: ItemType.Directory,
  parent: undefined,
  rootParent: undefined,
  breadcrumbs: ["svg", "elements", "animate Color"],
};

export const parseElementsContent = `{
  "svg": {
    "elements": {
      "animateColor": {
        "__compat": {
          "mdn_url": "https://developer.mozilla.org/docs/Web/SVG/Element/animateColor",
          "support": {
            "chrome": {
              "version_added": false
            }
          }
        },
        "by": {
          "__compat": {
            "support": {
              "chrome": {
                "version_added": false
              }
            }
          }
        }
      }
    }
  }
}`;

export const parseElementsWithNestingContent = `
{
  "webdriver": {
    "commands": {
      "AcceptAlert": {
        "__compat": {
          "mdn_url": "https://developer.mozilla.org/docs/Web/WebDriver/Commands/AcceptAlert",
          "support": {
            "chrome": {
              "version_added": "65"
            }
          },
          "status": {
            "experimental": false
          }
        },
        "scheme": {
          "wildcard": {
            "__compat": {
              "description": "Wildcard <code>*</code> scheme"
            }
          }
        }
      }
    }
  }
}`;

export const parseElementsWithNestingItem = {
  name: "Accept Alert",
  url:
    "https://api.github.com/repos/mdn/browser-compat-data/contents/webdriver/commands/AcceptAlert.json?ref=master",
  type: ItemType.Directory,
  parent: {
    name: "commands",
    url:
      "https://api.github.com/repos/mdn/browser-compat-data/contents/webdriver/commands?ref=master",
    type: ItemType.Directory,
    parent: undefined,
    rootParent: undefined,
    breadcrumbs: ["webdriver", "commands"],
  },
  rootParent: undefined,
  breadcrumbs: ["webdriver", "commands", "Accept Alert"],
};

export const parseElementsWithEmptyCompatContent = `
{
  "webdriver": {
    "commands": {
      "AcceptAlert": {
        "__compat": {
        }
      }
    }
  }
}
`;

export const parseElementsWithEmptyCompatItem = parseElementsWithNestingItem;

export const parseElementsWithNoCompatContent = `
{
  "webdriver": {
    "commands": {
    }
  }
}
`;

export const parseElementsWithNoCompatItem = parseElementsWithNestingItem;

export const parseDirectoriesItem: Item = {
  name: "api",
  url: "#",
  type: ItemType.Directory,
  breadcrumbs: ["api"],
};

export const parseDirectoriesContent: Array<any> = [
  {
    url:
      "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortController.json?ref=master",
    type: ItemType.Directory,
  },
  {
    url:
      "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortPaymentEvent.json?ref=master",
    type: ItemType.Directory,
  },
];

export const directoriesOutputItems: Item[] = [
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
