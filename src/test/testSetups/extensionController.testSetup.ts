import * as vscode from "vscode";
import ExtensionController from "../../extensionController";
import { stubMultiple, restoreStubbedMultiple } from "../util/stubHelpers";

export const getTestSetups = (extensionController: ExtensionController) => {
  const extensionControllerAny = extensionController as any;

  return {
    browse1() {
      return stubMultiple([
        { object: extensionControllerAny.quickPick, method: "show" },
        {
          object: extensionControllerAny.quickPick,
          method: "loadQuickPickData",
        },
      ]);
    },
    clearCache1() {
      return stubMultiple([
        { object: extensionControllerAny.cache, method: "clearCache" },
      ]);
    },
  };
};
