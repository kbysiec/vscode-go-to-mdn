import ItemType from "../../enum/itemType";

export const itemsInput: any = {
  items: [
    {
      name: "sub-label",
      url: "#",
      breadcrumbs: ["api", "test-label", "sub-label"],
      parent: {
        name: "elements",
        url: "https://api.github.com/repos/mdn/browser-compat-data/contents/svg/elements?ref=main",
        type: ItemType.Directory,
        parent: undefined,
        rootParent: undefined,
        breadcrumbs: ["svg", "elements"],
      },
    },
    {
      name: "sub-label 2",
      url: "https://sub-label-2.com",
      breadcrumbs: ["api", "test-label", "sub-label 2"],
    },
  ],
};
