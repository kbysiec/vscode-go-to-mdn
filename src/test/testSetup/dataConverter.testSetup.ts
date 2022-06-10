import * as sinon from "sinon";
import * as config from "../../config";
import ItemType from "../../enum/itemType";
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
      stubMultiple(
        [
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: false,
          },
        ],
        sandbox
      );

      const expectedSecondItem: QuickPickItem = {
        label: `$(file-directory) sub-label`,
        url: "#",
        type: ItemType.Directory,
        parent: undefined,
        rootParent: undefined,
        breadcrumbs: ["api", "test-label", "sub-label"],
        description: "",
      };

      return expectedSecondItem;
    },
    prepareQpData2: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: true,
          },
        ],
        sandbox
      );

      const expectedSecondItem: QuickPickItem = {
        label: `$(link) sub-label 2`,
        url: "https://sub-label-2.com",
        type: ItemType.File,
        parent: undefined,
        rootParent: undefined,
        breadcrumbs: ["api", "test-label", "sub-label 2"],
        description: "api test-label sub-label 2",
      };

      return expectedSecondItem;
    },
    mapQpItemToItem1: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: true,
          },
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
        parent: undefined,
        rootParent: undefined,
        type: ItemType.File,
        breadcrumbs: [],
      };

      return expected;
    },
  };
};
