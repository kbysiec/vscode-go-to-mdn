import * as sinon from "sinon";
import * as vscode from "vscode";
import { appConfig } from "../../appConfig";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();

  const getSearchUrl = () => {
    const baseUrl = "https://developer.mozilla.org/en-US/search";
    stubMultiple(
      [
        {
          object: appConfig,
          method: "searchUrl",
          returns: baseUrl,
          isNotMethod: true,
        },
      ],
      sandbox
    );

    return baseUrl;
  };
  return {
    afterEach: () => {
      sandbox.restore();
    },
    getSearchUrl1: () => {
      return getSearchUrl();
    },
    getSearchUrl2: () => {
      return getSearchUrl();
    },
    printErrorMessage1: () => {
      return stubMultiple(
        [
          {
            object: vscode.window,
            method: "showInformationMessage",
          },
        ],
        sandbox
      );
    },
    printClearCacheMessage1: () => {
      return stubMultiple(
        [
          {
            object: vscode.window,
            method: "showInformationMessage",
          },
        ],
        sandbox
      );
    },
  };
};
