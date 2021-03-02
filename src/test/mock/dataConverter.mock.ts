import ItemType from "../../enum/itemType";
import QuickPickItem from "../../interface/quickPickItem";
import Item from "../../interface/item";

export const qpItemDirectory: QuickPickItem = {
  label: "api test-label sub-label",
  url: "#",
  type: ItemType.Directory,
  breadcrumbs: [],
};

export const qpItemFile: QuickPickItem = {
  label: "api test-label sub-label",
  url: "#",
  type: ItemType.File,
  breadcrumbs: [],
};

export const qpItemEmptyLabel: QuickPickItem = {
  label: "",
  url: "#",
  type: ItemType.File,
  breadcrumbs: [],
};

export const qpItems: QuickPickItem[] = [
  {
    label: "api test-label sub-label",
    url: "#",
    type: ItemType.File,
    breadcrumbs: ["api", "test-label", "sub-label"],
  },
  {
    label: "api test-label sub-label 2",
    url: "",
    type: ItemType.File,
    breadcrumbs: [],
  },
  {
    label: "api test-label sub-label 3",
    url: "#",
    type: ItemType.File,
    breadcrumbs: [],
  },
];

export const item: Item = {
  name: "sub-label",
  url: "#",
  type: ItemType.File,
  breadcrumbs: ["api", "test-label", "sub-label"],
};

export const itemEmptyName: Item = {
  name: "",
  url: "#",
  type: ItemType.File,
  breadcrumbs: [""],
};

export const items: Item[] = [
  {
    name: "sub-label",
    url: "#",
    type: ItemType.Directory,
    breadcrumbs: ["api", "test-label", "sub-label"],
  },
  {
    name: "sub-label 2",
    url: "https://sub-label-2.com",
    type: ItemType.File,
    breadcrumbs: ["api", "test-label", "sub-label 2"],
  },
];

export const itemsMixedFileType: Item[] = [
  {
    name: "sub-label",
    url: "#",
    type: ItemType.File,
    breadcrumbs: ["api", "test-label", "sub-label"],
  },
  {
    name: "sub-label 2",
    url: "https://sub-label-2.com",
    type: ItemType.Directory,
    breadcrumbs: ["api", "test-label", "sub-label 2"],
  },
];
