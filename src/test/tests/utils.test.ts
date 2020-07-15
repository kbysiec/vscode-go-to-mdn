import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import Utils from "../../utils";
import QuickPickItem from "../../interfaces/QuickPickItem";
import { appConfig } from "../../appConfig";
import * as mock from "../mocks/utils.mock";

describe("Utils", () => {
  let utils: Utils;
  let utilsAny: any;

  before(() => {
    utils = new Utils();
    utilsAny = utils as any;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("isValueStringType", () => {
    it("should return true if value is a string", () => {
      const actual = utils.isValueStringType("test");
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should return false if value is not a string", () => {
      const qpItem: QuickPickItem = mock.qpItemFile;

      const actual = utils.isValueStringType(qpItem);
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe("isValueFileType", () => {
    it("should return true if value type is file", () => {
      const qpItem: QuickPickItem = mock.qpItemFile;

      const actual = utils.isValueFileType(qpItem);
      const expected = true;
      assert.equal(actual, expected);
    });

    it("should return false if value type is directory", () => {
      const qpItem: QuickPickItem = mock.qpItemDirectory;

      const actual = utils.isValueFileType(qpItem);
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe("getSearchUrl", () => {
    it("should return search url with query string", () => {
      const baseUrl = "https://developer.mozilla.org/en-US/search";
      sinon.stub(appConfig, "searchUrl").value(baseUrl);

      const actual = utils.getSearchUrl("string includes 123");
      const expected = `${baseUrl}?q=string+includes+123`;
      assert.equal(actual, expected);
    });

    it("should return search url without query string", () => {
      const baseUrl = "https://developer.mozilla.org/en-US/search";
      sinon.stub(appConfig, "searchUrl").value(baseUrl);

      const actual = utils.getSearchUrl("");
      const expected = `${baseUrl}?q=`;
      assert.equal(actual, expected);
    });
  });

  describe("getNameFromQuickPickItem", () => {
    it("should return name from label without first category", () => {
      const qpItem: QuickPickItem = mock.qpItemFile;

      const actual = utils.getNameFromQuickPickItem(qpItem);
      const expected = "test-label sub-label";
      assert.equal(actual, expected);
    });

    it("should return empty name", () => {
      const qpItem: QuickPickItem = mock.qpItemEmptyLabel;

      const actual = utils.getNameFromQuickPickItem(qpItem);
      const expected = "";
      assert.equal(actual, expected);
    });
  });

  describe("removeDataWithEmptyUrl", () => {
    it("should return name from label without first category", () => {
      const qpItems: QuickPickItem[] = mock.qpItems;
      const actual = utils.removeDataWithEmptyUrl(qpItems).length;
      const expected = 2;
      assert.equal(actual, expected);
    });
  });
});
