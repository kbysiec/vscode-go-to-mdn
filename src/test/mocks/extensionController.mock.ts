import ItemType from "../../enums/itemType";
import QuickPickExtendedItem from "../../interfaces/quickPickExtendedItem";
import Item from "../../interfaces/item";

export const qpItem: QuickPickExtendedItem = {
  label: "api test-label sub-label 3",
  url: "http://test.com",
  type: ItemType.File,
  breadcrumbs: ["api", "test-label", "sub-label 3"]
};

export const qpItemDirectoryType: QuickPickExtendedItem = {
  label: "api test-label sub-label 3",
  url: "#",
  type: ItemType.Directory,
  breadcrumbs: ["api", "test-label", "sub-label 3"]
};

export const qpItems: QuickPickExtendedItem[] = [
  {
    label: `$(link) sub-label`,
    url: "#",
    type: ItemType.File,
    parent: undefined,
    rootParent: undefined,
    breadcrumbs: ["api", "test-label", "sub-label"],
    description: "api test-label sub-label"
  },
  {
    label: `$(link) sub-label 2`,
    url: "https://sub-label-2.com",
    type: ItemType.File,
    parent: undefined,
    rootParent: undefined,
    breadcrumbs: ["api", "test-label", "sub-label 2"],
    description: "api test-label sub-label 2"
  }
];

export const items: Item[] = [
  {
    name: "sub-label",
    url: "#",
    type: ItemType.File,
    breadcrumbs: ["api", "test-label", "sub-label"]
  },
  {
    name: "sub-label 2",
    url: "https://sub-label-2.com",
    type: ItemType.File,
    breadcrumbs: ["api", "test-label", "sub-label 2"]
  }
];

export const backwardNavigationQpItem: QuickPickExtendedItem = {
  label: `$(file-directory) ..`,
  description: "",
  type: ItemType.Directory,
  url: "#",
  breadcrumbs: []
};