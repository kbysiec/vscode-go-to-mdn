import * as sinon from "sinon";
import * as vscode from "vscode";
import { getConfiguration, getVscodeConfiguration } from "../util/mockFactory";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();
  const configuration = getConfiguration();

  return {
    before: () => {
      stubMultiple(
        [
          {
            object: vscode.workspace,
            method: "getConfiguration",
            returns: getVscodeConfiguration(configuration),
          },
        ],
        sandbox
      );

      return {
        configuration,
      };
    },
    afterEach: () => {
      sandbox.restore();
    },
  };
};
