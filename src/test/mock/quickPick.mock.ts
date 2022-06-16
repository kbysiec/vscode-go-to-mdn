import QuickPickItem from "../../interface/quickPickItem";

export const qpItem: QuickPickItem = {
  label: "api test-label sub-label",
  url: "http://test.com",
  breadcrumbs: [],
};

export const qpItems: QuickPickItem[] = [
  {
    label: "api test-label sub-label",
    description: "description",
    url: "#",
    breadcrumbs: [],
  },
  {
    label: "api foo-label sub-label 2",
    description: "description 2",
    url: "",
    breadcrumbs: [],
  },
  {
    label: "api bar-label sub-label 3",
    description: "description test 3",
    url: "#",
    breadcrumbs: [],
  },
];

export const qpItemDirectoryType: QuickPickItem = {
  label: "api test-label sub-label 3",
  url: "#",
  breadcrumbs: ["api", "test-label", "sub-label 3"],
};
