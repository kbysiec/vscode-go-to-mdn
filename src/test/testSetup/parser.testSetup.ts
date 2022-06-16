import Item from "../../interface/item";

export const getTestSetups = () => {
  return {
    parseData1: () => {
      const expected: Item[] = [
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

      return expected;
    },
  };
};
