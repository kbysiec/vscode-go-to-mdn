import ItemType from "../../enum/itemType";
import QuickPickItem from "../../interface/quickPickItem";
import Item from "../../interface/item";

export const qpItem: QuickPickItem = {
  label: "api test-label sub-label 3",
  url: "http://test.com",
  type: ItemType.File,
  breadcrumbs: ["api", "test-label", "sub-label 3"],
};

export const qpItemDirectoryType: QuickPickItem = {
  label: "api test-label sub-label 3",
  url: "#",
  type: ItemType.Directory,
  breadcrumbs: ["api", "test-label", "sub-label 3"],
};

export const qpItems: QuickPickItem[] = [
  {
    label: `$(link) sub-label`,
    url: "#",
    type: ItemType.File,
    parent: undefined,
    rootParent: undefined,
    breadcrumbs: ["api", "test-label", "sub-label"],
    description: "api test-label sub-label",
  },
  {
    label: `$(link) sub-label 2`,
    url: "https://sub-label-2.com",
    type: ItemType.File,
    parent: undefined,
    rootParent: undefined,
    breadcrumbs: ["api", "test-label", "sub-label 2"],
    description: "api test-label sub-label 2",
  },
];

export const items: Item[] = [
  {
    name: "sub-label",
    url: "#",
    type: ItemType.File,
    breadcrumbs: ["api", "test-label", "sub-label"],
  },
  {
    name: "sub-label 2",
    url: "https://sub-label-2.com",
    type: ItemType.File,
    breadcrumbs: ["api", "test-label", "sub-label 2"],
  },
];

export const backwardNavigationQpItem: QuickPickItem = {
  label: `$(file-directory) ..`,
  description: "",
  type: ItemType.Directory,
  url: "#",
  breadcrumbs: [],
};
