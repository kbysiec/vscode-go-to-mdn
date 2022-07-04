import * as sinon from "sinon";
import Item from "../../interface/item";
import * as utils from "../../utils";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();

  return {
    afterEach: () => {
      sandbox.restore();
    },
    mapQpItemToItem1: () => {
      stubMultiple(
        [
          {
            object: utils,
            method: "getNameFromQuickPickItem",
            returns: "test-label sub-label",
          },
        ],
        sandbox
      );

      const expected: Item = {
        name: "test-label sub-label",
        url: "#",
        breadcrumbs: [],
      };

      return expected;
    },
  };
};
