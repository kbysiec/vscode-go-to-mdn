import * as sinon from "sinon";
import * as cache from "../../cache";
import { quickPick } from "../../quickPick";
import * as utils from "../../utils";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();

  return {
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
