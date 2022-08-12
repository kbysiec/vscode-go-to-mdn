import * as sinon from "sinon";
import * as cache from "../../cache";
import { quickPick } from "../../quickPick";
import * as utils from "../../utils";
import { stubMultiple } from "../util/stubHelpers";

// type ExtensionController = typeof ExtensionController;

// const getComponent = (sandbox: sinon.SinonSandbox) => {
//   stubMultiple(
//     [
//       { object: cache, method: "initCache" },
//       {
//         object: quickPick,
//         method: "init",
//         returns: {
//           showQuickPick: () => {},
//           loadQuickPickData: () => {},
//         },
//       },
//     ],
//     sandbox
//   );
//   const context: vscode.ExtensionContext = getExtensionContext();
//   const { init } = ExtensionController;
//   return {
//     extensionController: init(context),
//   };
// };

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();
  // const { extensionController } = getComponent(sandbox);

  return {
    // before: () => {
    //   return extensionController;
    // },
    afterEach: () => {
      sandbox.restore();
    },
    browse1() {
      return stubMultiple(
        [
          { object: quickPick, method: "showQuickPick" },
          {
            object: quickPick,
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
