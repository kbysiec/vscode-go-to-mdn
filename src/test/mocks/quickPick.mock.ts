import QuickPickItem from "../../interfaces/quickPickItem";
import ItemType from "../../enums/itemType";

export const qpItem: QuickPickItem = {
  label: "api test-label sub-label",
  url: "http://test.com",
  type: ItemType.File,
  breadcrumbs: [],
};

export const qpItems: QuickPickItem[] = [
  {
    label: "api test-label sub-label",
    description: "description",
    url: "#",
    type: ItemType.File,
    breadcrumbs: [],
  },
  {
    label: "api foo-label sub-label 2",
    description: "description 2",
    url: "",
    type: ItemType.File,
    breadcrumbs: [],
  },
  {
    label: "api bar-label sub-label 3",
    description: "description test 3",
    url: "#",
    type: ItemType.File,
    breadcrumbs: [],
  },
];

export const qpItemDirectoryType: QuickPickItem = {
  label: "api test-label sub-label 3",
  url: "#",
  type: ItemType.Directory,
  breadcrumbs: ["api", "test-label", "sub-label 3"],
};
