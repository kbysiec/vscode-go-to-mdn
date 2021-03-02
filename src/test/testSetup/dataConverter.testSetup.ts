import * as vscode from "vscode";
import DataConverter from "../../dataConverter";
import ItemType from "../../enum/itemType";
import Item from "../../interface/item";
import QuickPickItem from "../../interface/quickPickItem";
import { restoreStubbedMultiple, stubMultiple } from "../util/stubHelpers";

export const getTestSetups = (dataConverter: DataConverter) => {
  const dataConverterAny = dataConverter as any;

  return {
    prepareQpData1: () => {
      restoreStubbedMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
        },
      ]);

      stubMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
      ]);

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
      restoreStubbedMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
        },
      ]);

      stubMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
      ]);

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
      restoreStubbedMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
        },
        {
          object: dataConverterAny.utils,
          method: "getNameFromQuickPickItem",
        },
      ]);

      stubMultiple([
        {
          object: dataConverterAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
      ]);

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
