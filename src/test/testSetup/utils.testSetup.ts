import * as vscode from "vscode";
import { appConfig } from "../../appConfig";
import Utils from "../../utils";
import { stubMultiple, restoreStubbedMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const getSearchUrl = () => {
    const baseUrl = "https://developer.mozilla.org/en-US/search";
    stubMultiple([
      {
        object: appConfig,
        method: "searchUrl",
        returns: baseUrl,
        isNotMethod: true,
      },
    ]);

    return baseUrl;
  };
  return {
    getSearchUrl1: () => {
      return getSearchUrl();
    },
    getSearchUrl2: () => {
      return getSearchUrl();
    },
    printErrorMessage1: () => {
      return stubMultiple([
        {
          object: vscode.window,
          method: "showInformationMessage",
        },
      ]);
    },
    printClearCacheMessage1: () => {
      restoreStubbedMultiple([
        {
          object: vscode.window,
          method: "showInformationMessage",
        },
      ]);

      return stubMultiple([
        {
          object: vscode.window,
          method: "showInformationMessage",
        },
      ]);
    },
  };
};
