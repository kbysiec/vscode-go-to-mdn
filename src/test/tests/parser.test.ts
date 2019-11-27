import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import Parser from "../../parser";
import QuickPickExtendedItem from "../../interfaces/QuickPickExtendedItem";
import Item from "../../interfaces/Item";
import ItemType from "../../enums/ItemType";
import { config } from "../../config";

describe("Parser", function() {
  let parser: Parser;

  before(function() {
    parser = new Parser();
  });

  describe("parseFlatElements", function() {
    it("should function exist", function() {
      const actual = typeof parser.parseFlatElements;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return array of Item elements", function() {
      const inputData: any = {
        items: [
          {
            name: "sub-label",
            url: "#",
            breadcrumbs: ["api", "test-label", "sub-label"]
          },
          {
            name: "sub-label 2",
            url: "https://sub-label-2.com",
            breadcrumbs: ["api", "test-label", "sub-label 2"]
          }
        ]
      };

      const actual = parser.parseFlatElements(inputData);
      const expected: Item[] = [
        {
          name: "sub-label",
          url: "#",
          parent: undefined,
          type: ItemType.File,
          breadcrumbs: ["api", "test-label", "sub-label"]
        },
        {
          name: "sub-label 2",
          url: "https://sub-label-2.com",
          parent: undefined,
          type: ItemType.File,
          breadcrumbs: ["api", "test-label", "sub-label 2"]
        }
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return empty array", function() {
      const actual = parser.parseFlatElements({});
      const expected: Item[] = [];

      assert.deepEqual(actual, expected);
    });
  });

  describe("parseRootDirectories", function() {
    it("should function exist", function() {
      const actual = typeof parser.parseRootDirectories;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return array of Item elements once content contains has links", function() {
      const content = `*Please note that we have not (yet) migrated all compatibility data from the MDN wiki pages into this repository.*
      - [label/](https://github.com/mdn/browser-compat-data/tree/master/label) contains data for each Web API interface.
      - [category/](https://github.com/mdn/browser-compat-data/tree/master/category) contains data for CSS properties, selectors, and at-rules.
      [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) elements, attributes, and global attributes.
      ## Format of the browser compat json files`;

      const actual = parser.parseRootDirectories(content);
      const expected: Item[] = [
        {
          name: "label",
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/label?ref=master",
          type: ItemType.Directory,
          breadcrumbs: ["label"]
        },
        {
          name: "category",
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/category?ref=master",
          type: ItemType.Directory,
          breadcrumbs: ["category"]
        }
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return array of Item elements once content doesn't contain any link", function() {
      const content = `*Please note that we have not (yet) migrated all compatibility data from the MDN wiki pages into this repository.*
      [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) elements, attributes, and global attributes.
      ## Format of the browser compat json files`;

      const actual = parser.parseRootDirectories(content);
      const expected: Item[] = [];

      assert.deepEqual(actual, expected);
    });
  });

  describe("parseElements", function() {
    let content: string;
    before(function() {
      content = `{
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
    });

    it("should function exist", function() {
      const actual = typeof parser.parseElements;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return array of Item elements if content is array of files without unnecessary nesting of keys", function() {
      const item: Item = {
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
          breadcrumbs: ["svg", "elements"]
        },
        rootParent: undefined,
        breadcrumbs: ["svg", "elements", "animate Color"]
      };

      const actual = parser.parseElements(content, item);
      const expected: Item[] = [
        {
          name: "animate Color - reference",
          url:
            "https://developer.mozilla.org/docs/Web/SVG/Element/animateColor",
          type: ItemType.File,
          parent: item,
          breadcrumbs: ["svg", "elements", "animate Color", "animate Color"]
        },
        {
          name: "by",
          url: "",
          type: ItemType.File,
          parent: item,
          breadcrumbs: ["svg", "elements", "animate Color", "by"]
        }
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return array of Item elements if content is array of files with unnecessary nesting of keys", function() {
      content = `
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
      }
      `;

      const item: Item = {
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
          breadcrumbs: ["webdriver", "commands"]
        },
        rootParent: undefined,
        breadcrumbs: ["webdriver", "commands", "Accept Alert"]
      };

      const actual = parser.parseElements(content, item);
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url:
            "https://developer.mozilla.org/docs/Web/WebDriver/Commands/AcceptAlert",
          type: ItemType.File,
          parent: item,
          breadcrumbs: ["webdriver", "commands", "Accept Alert", "Accept Alert"]
        },
        {
          name: "wildcard",
          url: "",
          type: ItemType.File,
          parent: item,
          breadcrumbs: ["webdriver", "commands", "Accept Alert", "wildcard"]
        }
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return array of 1 Item element if content contains object with empty __compat property", function() {
      content = `
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

      const item: Item = {
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
          breadcrumbs: ["webdriver", "commands"]
        },
        rootParent: undefined,
        breadcrumbs: ["webdriver", "commands", "Accept Alert"]
      };

      const actual = parser.parseElements(content, item);
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url: "",
          type: ItemType.File,
          parent: item,
          breadcrumbs: ["webdriver", "commands", "Accept Alert", "Accept Alert"]
        }
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return array of 1 Item element if content doesn't contain any object with __compat property", function() {
      content = `
      {
        "webdriver": {
          "commands": {
          }
        }
      }
      `;

      const item: Item = {
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
          breadcrumbs: ["webdriver", "commands"]
        },
        rootParent: undefined,
        breadcrumbs: ["webdriver", "commands", "Accept Alert"]
      };

      const actual = parser.parseElements(content, item);
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url: "",
          type: ItemType.File,
          parent: item,
          breadcrumbs: ["webdriver", "commands", "Accept Alert", "Accept Alert"]
        }
      ];

      assert.deepEqual(actual, expected);
    });

    it("should return empty array if parent element is undefined", function() {
      const item: Item = {
        name: "animate Color",
        url:
          "https://api.github.com/repos/mdn/browser-compat-data/contents/svg/elements/animateColor.json?ref=master",
        type: ItemType.Directory,
        parent: undefined,
        rootParent: undefined,
        breadcrumbs: ["svg", "elements", "animate Color"]
      };

      const actual = parser.parseElements(content, item);
      const expected: Item[] = [];

      assert.deepEqual(actual, expected);
    });
  });

  describe("parseDirectories", function() {
    it("should function exist", function() {
      const actual = typeof parser.parseDirectories;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should return array of Item elements if content is array of directories", function() {
      const item: Item = {
        name: "api",
        url: "#",
        type: ItemType.Directory,
        breadcrumbs: ["api"]
      };

      const content = [
        {
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortController.json?ref=master",
          type: ItemType.Directory
        },
        {
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortPaymentEvent.json?ref=master",
          type: ItemType.Directory
        }
      ];

      const actual = parser.parseDirectories(content, item);
      const expected: Item[] = [
        {
          name: "Abort Controller",
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortController.json?ref=master",
          type: ItemType.Directory,
          parent: item,
          rootParent: item,
          breadcrumbs: ["api", "Abort Controller"]
        },
        {
          name: "Abort Payment Event",
          url:
            "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortPaymentEvent.json?ref=master",
          type: ItemType.Directory,
          parent: item,
          rootParent: item,
          breadcrumbs: ["api", "Abort Payment Event"]
        }
      ];

      assert.deepEqual(actual, expected);
    });
  });
});
