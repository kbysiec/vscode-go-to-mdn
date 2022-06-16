import * as sinon from "sinon";
import * as vscode from "vscode";
import * as cache from "../../cache";
import * as ExtensionController from "../../extensionController";
import * as quickPick from "../../quickPick";
import * as utils from "../../utils";
import { getExtensionContext } from "../util/mockFactory";
import { stubMultiple } from "../util/stubHelpers";

type ExtensionController = typeof ExtensionController;

const getComponent = (sandbox: sinon.SinonSandbox) => {
  stubMultiple(
    [
      { object: cache, method: "initCache" },
      {
        object: quickPick,
        method: "createQuickPick",
        returns: {
          showQuickPick: () => {},
          loadQuickPickData: () => {},
        },
      },
    ],
    sandbox
  );
  const context: vscode.ExtensionContext = getExtensionContext();
  const { createExtensionController } = ExtensionController;
  return {
    extensionController: createExtensionController(context),
  };
};

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();
  const { extensionController } = getComponent(sandbox);

  return {
    before: () => {
      return extensionController;
    },
    afterEach: () => {
      sandbox.restore();
    },
    browse1() {
      return stubMultiple(
        [
          { object: extensionController.quickPick, method: "showQuickPick" },
          {
            object: extensionController.quickPick,
            method: "loadQuickPickData",
          },
        ],
        sandbox
      );
    },
    clearCache1() {
      return stubMultiple(
        [
          { object: cache, method: "clearCache" },
          { object: utils, method: "printClearCacheMessage" },
        ],
        sandbox
      );
    },
  };
};
