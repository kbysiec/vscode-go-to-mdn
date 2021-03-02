import * as vscode from "vscode";
import Config from "../../config";
import { getConfiguration, getVscodeConfiguration } from "../util/mockFactory";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = (config: Config) => {
  const configuration = getConfiguration();

  return {
    beforeEach: () => {
      return {
        configuration,
        stubs: stubMultiple([
          {
            object: vscode.workspace,
            method: "getConfiguration",
            returns: getVscodeConfiguration(configuration),
          },
        ]),
      };
    },
  };
};
