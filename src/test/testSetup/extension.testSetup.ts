import * as sinon from "sinon";
import * as vscode from "vscode";
import { extensionController } from "../../extensionController";
import { getExtensionContext } from "../util/mockFactory";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();
  const context = getExtensionContext();

  return {
    before: () => {
      return context;
    },
    afterEach: () => {
      sandbox.restore();
    },
    activate1: () => {
      return stubMultiple(
        [{ object: vscode.commands, method: "registerCommand" }],
        sandbox
      );
    },
    deactivate1: () => {
      return stubMultiple([{ object: console, method: "log" }], sandbox);
    },
    browse1: () => {
      return stubMultiple(
        [{ object: extensionController, method: "browse" }],
        sandbox
      );
    },
    clearCache1: () => {
      return stubMultiple(
        [{ object: extensionController, method: "clear" }],
        sandbox
      );
    },
  };
};
