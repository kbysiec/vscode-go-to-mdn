import * as vscode from "vscode";
import { getConfiguration, getVscodeConfiguration } from "../util/mockFactory";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const configuration = getConfiguration();

  return {
    beforeEach: () => {
      stubMultiple([
        {
          object: vscode.workspace,
          method: "getConfiguration",
          returns: getVscodeConfiguration(configuration),
        },
      ]);

      return {
        configuration,
      };
    },
  };
};
