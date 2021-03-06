import * as vscode from "vscode";
import { assert } from "chai";
import Utils from "../../utils";
import { appConfig } from "../../appConfig";
import * as mock from "../mock/utils.mock";
import { stubMultiple, restoreStubbedMultiple } from "../util/stubUtils";
import { getTestSetups } from "../testSetup/utils.testSetup";

describe("Utils", () => {
  let utils: Utils = new Utils();
  let setups = getTestSetups();

  beforeEach(() => {
    utils = new Utils();
    setups = getTestSetups();
  });

  describe("isValueStringType", () => {
    it("1: should return true if value is a string", () => {
      assert.equal(utils.isValueStringType("test"), true);
    });

    it("2: should return false if value is not a string", () => {
      assert.equal(utils.isValueStringType(mock.qpItemFile), false);
    });
  });

  describe("isValueFileType", () => {
    it("1: should return true if value type is file", () => {
      assert.equal(utils.isValueFileType(mock.qpItemFile), true);
    });

    it("2: should return false if value type is directory", () => {
      assert.equal(utils.isValueFileType(mock.qpItemDirectory), false);
    });
  });

  describe("getSearchUrl", () => {
    it("1: should return search url with query string", () => {
      const baseUrl = setups.getSearchUrl1();
      assert.equal(
        utils.getSearchUrl("string includes 123"),
        `${baseUrl}?q=string+includes+123`
      );
    });

    it("2: should return search url without query string", () => {
      const baseUrl = setups.getSearchUrl2();
      assert.equal(utils.getSearchUrl(""), `${baseUrl}?q=`);
    });
  });

  describe("getNameFromQuickPickItem", () => {
    it("1: should return name from label without first category", () => {
      assert.equal(
        utils.getNameFromQuickPickItem(mock.qpItemFile),
        "test-label sub-label"
      );
    });

    it("2: should return empty name", () => {
      assert.equal(utils.getNameFromQuickPickItem(mock.qpItemEmptyLabel), "");
    });
  });

  describe("removeDataWithEmptyUrl", () => {
    it("1: should remove qpItems with empty url", () => {
      assert.equal(utils.removeDataWithEmptyUrl(mock.qpItems).length, 2);
    });
  });

  describe("printErrorMessage", () => {
    it("1: should display notification", async () => {
      const [showInformationMessageStub] = setups.printErrorMessage1();
      utils.printErrorMessage(new Error("test error message"));
      assert.equal(showInformationMessageStub.calledOnce, true);
    });
  });

  describe("printClearCacheMessage", () => {
    it("1: should display notification", async () => {
      const [showInformationMessageStub] = setups.printClearCacheMessage1();
      utils.printClearCacheMessage();
      assert.equal(showInformationMessageStub.calledOnce, true);
    });
  });
});
