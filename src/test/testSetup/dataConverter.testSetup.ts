import * as sinon from "sinon";
import Item from "../../interface/item";
import QuickPickItem from "../../interface/quickPickItem";
import * as utils from "../../utils";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();

  return {
    afterEach: () => {
      sandbox.restore();
    },
    prepareQpData1: () => {
      const expectedSecondItem: QuickPickItem = {
        label: `$(link) sub-label 2`,
        url: "https://sub-label-2.com",
        breadcrumbs: ["api", "test-label", "sub-label 2"],
        description: "api test-label sub-label 2",
      };

      return expectedSecondItem;
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
