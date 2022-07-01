import Item from "../../interface/item";
import QuickPickItem from "../../interface/quickPickItem";

export const item: Item = {
  name: "sub-label 3",
  url: "#",
  breadcrumbs: ["api", "test-label", "sub-label 3"],
};

export const items: Item[] = [
  {
    name: "sub-label",
    url: "#",
    breadcrumbs: ["api", "test-label", "sub-label"],
  },
  {
    name: "sub-label 2",
    url: "https://sub-label-2.com",
    breadcrumbs: ["api", "test-label", "sub-label 2"],
  },
];

export const qpItem: QuickPickItem = {
  label: "test-label",
  url: "#",
  breadcrumbs: [],
};
