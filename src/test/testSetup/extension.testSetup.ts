import * as sinon from "sinon";
import * as vscode from "vscode";
import * as extensionController from "../../extensionController";
import { getExtensionContext } from "../util/mockFactory";
import { stubMultiple } from "../util/stubHelpers";

const getComponent = (sandbox: sinon.SinonSandbox) => {
  const context = getExtensionContext();
  const extensionControllerStub = {
    browse: () => Promise.resolve(),
    clear: () => {},
  };

  stubMultiple(
    [
      {
        object: extensionController,
        method: "createExtensionController",
        returns: extensionControllerStub,
      },
    ],
    sandbox
  );
  return {
    context,
    extensionController: extensionControllerStub,
  };
};

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();
  const { context, extensionController } = getComponent(sandbox);

  return {
    before: () => {
      return { context, extensionController };
    },
    afterEach: () => {
      sandbox.restore();
    },
    activate1: () => {
      return stubMultiple([
        { object: vscode.commands, method: "registerCommand" },
      ]);
    },
    deactivate1: () => {
      return stubMultiple([{ object: console, method: "log" }]);
    },
    browse1: () => {
      return stubMultiple([{ object: extensionController, method: "browse" }]);
    },
    clearCache1: () => {
      return stubMultiple([{ object: extensionController, method: "clear" }]);
    },
  };
};
