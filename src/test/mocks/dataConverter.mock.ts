import ItemType from "../../enums/itemType";
import QuickPickExtendedItem from "../../interfaces/quickPickExtendedItem";
import Item from "../../interfaces/item";

export const qpItemDirectory: QuickPickExtendedItem = {
  label: "api test-label sub-label",
  url: "#",
  type: ItemType.Directory,
  breadcrumbs: []
};

export const qpItemFile: QuickPickExtendedItem = {
  label: "api test-label sub-label",
  url: "#",
  type: ItemType.File,
  breadcrumbs: []
};

export const qpItemEmptyLabel: QuickPickExtendedItem = {
  label: "",
  url: "#",
  type: ItemType.File,
  breadcrumbs: []
};

export const qpItems: QuickPickExtendedItem[] = [
  {
    label: "api test-label sub-label",
    url: "#",
    type: ItemType.File,
    breadcrumbs: ["api", "test-label", "sub-label"]
  },
  {
    label: "api test-label sub-label 2",
    url: "",
    type: ItemType.File,
    breadcrumbs: []
  },
  {
    label: "api test-label sub-label 3",
    url: "#",
    type: ItemType.File,
    breadcrumbs: []
  }
];

export const item: Item = {
  name: "sub-label",
  url: "#",
  type: ItemType.File,
  breadcrumbs: ["api", "test-label", "sub-label"]
};

export const itemEmptyName: Item = {
  name: "",
  url: "#",
  type: ItemType.File,
  breadcrumbs: [""]
};

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

export const itemsMixedFileType: Item[] = [
  {
    name: "sub-label",
    url: "#",
    type: ItemType.File,
    breadcrumbs: ["api", "test-label", "sub-label"]
  },
  {
    name: "sub-label 2",
    url: "https://sub-label-2.com",
    type: ItemType.Directory,
    breadcrumbs: ["api", "test-label", "sub-label 2"]
  }
];
