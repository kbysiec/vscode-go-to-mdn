import Item from "../../interface/item";
import QuickPickItem from "../../interface/quickPickItem";

export const qpItemDirectory: QuickPickItem = {
  label: "api test-label sub-label",
  url: "#",
  breadcrumbs: [],
};

export const qpItemFile: QuickPickItem = {
  label: "api test-label sub-label",
  url: "#",
  breadcrumbs: [],
};

export const qpItemEmptyLabel: QuickPickItem = {
  label: "",
  url: "#",
  breadcrumbs: [],
};

export const qpItems: QuickPickItem[] = [
  {
    label: "api test-label sub-label",
    url: "#",
    breadcrumbs: ["api", "test-label", "sub-label"],
  },
  {
    label: "api test-label sub-label 2",
    url: "",
    breadcrumbs: [],
  },
  {
    label: "api test-label sub-label 3",
    url: "#",
    breadcrumbs: [],
  },
];

export const item: Item = {
  name: "sub-label",
  url: "#",
  breadcrumbs: ["api", "test-label", "sub-label"],
};

export const itemEmptyName: Item = {
  name: "",
  url: "#",
  breadcrumbs: [""],
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

export const itemsMixedFileType: Item[] = [
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
