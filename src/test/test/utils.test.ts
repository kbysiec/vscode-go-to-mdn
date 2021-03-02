import * as vscode from "vscode";
import { assert } from "chai";
import Utils from "../../utils";
import { appConfig } from "../../appConfig";
import * as mock from "../mock/utils.mock";
import { stubMultiple, restoreStubbedMultiple } from "../util/stubUtils";

describe("Utils", () => {
  let utils: Utils;

  beforeEach(() => {
    utils = new Utils();
  });

  describe("isValueStringType", () => {
    it("should return true if value is a string", () => {
      assert.equal(utils.isValueStringType("test"), true);
    });

    it("should return false if value is not a string", () => {
      assert.equal(utils.isValueStringType(mock.qpItemFile), false);
    });
  });

  describe("isValueFileType", () => {
    it("should return true if value type is file", () => {
      assert.equal(utils.isValueFileType(mock.qpItemFile), true);
    });

    it("should return false if value type is directory", () => {
      assert.equal(utils.isValueFileType(mock.qpItemDirectory), false);
    });
  });

  describe("getSearchUrl", () => {
    it("should return search url with query string", () => {
      const baseUrl = "https://developer.mozilla.org/en-US/search";
      stubMultiple([
        {
          object: appConfig,
          method: "searchUrl",
          returns: baseUrl,
          isNotMethod: true,
        },
      ]);

      assert.equal(
        utils.getSearchUrl("string includes 123"),
        `${baseUrl}?q=string+includes+123`
      );
    });

    it("should return search url without query string", () => {
      const baseUrl = "https://developer.mozilla.org/en-US/search";
      stubMultiple([
        {
          object: appConfig,
          method: "searchUrl",
          returns: baseUrl,
          isNotMethod: true,
        },
      ]);

      assert.equal(utils.getSearchUrl(""), `${baseUrl}?q=`);
    });
  });

  describe("getNameFromQuickPickItem", () => {
    it("should return name from label without first category", () => {
      assert.equal(
        utils.getNameFromQuickPickItem(mock.qpItemFile),
        "test-label sub-label"
      );
    });

    it("should return empty name", () => {
      assert.equal(utils.getNameFromQuickPickItem(mock.qpItemEmptyLabel), "");
    });
  });

  describe("removeDataWithEmptyUrl", () => {
    it("should remove qpItems with empty url", () => {
      assert.equal(utils.removeDataWithEmptyUrl(mock.qpItems).length, 2);
    });
  });

  describe("printErrorMessage", () => {
    it("should display notification", async () => {
      const [showInformationMessageStub] = stubMultiple([
        {
          object: vscode.window,
          method: "showInformationMessage",
        },
      ]);

      utils.printErrorMessage(new Error("test error message"));

      assert.equal(showInformationMessageStub.calledOnce, true);
    });
  });

  describe("printClearCacheMessage", () => {
    it("should display notification", async () => {
      restoreStubbedMultiple([
        {
          object: vscode.window,
          method: "showInformationMessage",
        },
      ]);
      const [showInformationMessageStub] = stubMultiple([
        {
          object: vscode.window,
          method: "showInformationMessage",
        },
      ]);

      utils.printClearCacheMessage();
      assert.equal(showInformationMessageStub.calledOnce, true);
    });
  });
});
