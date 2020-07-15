import Item from "../../interfaces/item";
import ItemType from "../../enums/itemType";
import QuickPickItem from "../../interfaces/quickPickItem";

export const item: Item = {
  name: "sub-label 3",
  url: "#",
  type: ItemType.File,
  breadcrumbs: ["api", "test-label", "sub-label 3"],
};

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

export const qpItem: QuickPickItem = {
  label: "test-label",
  url: "#",
  type: ItemType.Directory,
  breadcrumbs: [],
};
