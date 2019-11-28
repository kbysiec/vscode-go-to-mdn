import QuickPickExtendedItem from "../../interfaces/quickPickExtendedItem";
import ItemType from "../../enums/itemType";

export const qpItem: QuickPickExtendedItem = {
  label: "api test-label sub-label",
  url: "#",
  type: ItemType.File,
  breadcrumbs: []
};

export const qpItems: QuickPickExtendedItem[] = [
  {
    label: "api test-label sub-label",
    description: "description",
    url: "#",
    type: ItemType.File,
    breadcrumbs: []
  },
  {
    label: "api foo-label sub-label 2",
    description: "description 2",
    url: "",
    type: ItemType.File,
    breadcrumbs: []
  },
  {
    label: "api bar-label sub-label 3",
    description: "description test 3",
    url: "#",
    type: ItemType.File,
    breadcrumbs: []
  }
];
