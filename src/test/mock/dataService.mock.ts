import Item from "../../interface/item";
import QuickPickItem from "../../interface/quickPickItem";

export const qpItem: QuickPickItem = {
  label: "api test-label sub-label 3",
  url: "http://test.com",
  breadcrumbs: ["api", "test-label", "sub-label 3"],
};

export const qpItemDirectoryType: QuickPickItem = {
  label: "api test-label sub-label 3",
  url: "#",
  breadcrumbs: ["api", "test-label", "sub-label 3"],
};

export const qpItems: QuickPickItem[] = [
  {
    label: `$(link) sub-label`,
    url: "#",
    breadcrumbs: ["api", "test-label", "sub-label"],
    description: "api test-label sub-label",
  },
  {
    label: `$(link) sub-label 2`,
    url: "https://sub-label-2.com",
    breadcrumbs: ["api", "test-label", "sub-label 2"],
    description: "api test-label sub-label 2",
  },
];

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

export const backwardNavigationQpItem: QuickPickItem = {
  label: `$(file-directory) ..`,
  description: "",
  url: "#",
  breadcrumbs: [],
};
