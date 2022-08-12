import * as sinon from "sinon";
import * as vscode from "vscode";
import * as cache from "../../cache";
import { controller } from "../../controller";
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
        [
          {
            object: vscode.commands,
            method: "registerCommand",
          },
          {
            object: cache,
            method: "initCache",
          },
          {
            object: controller,
            method: "init",
          },
        ],
        sandbox
      );
    },
    deactivate1: () => {
      return stubMultiple([{ object: console, method: "log" }], sandbox);
    },
    browse1: () => {
      return stubMultiple([{ object: controller, method: "browse" }], sandbox);
    },
    clearCache1: () => {
      return stubMultiple([{ object: controller, method: "clear" }], sandbox);
    },
  };
};
