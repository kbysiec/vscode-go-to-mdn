import { OutputData } from "../../interface/outputData";

export const emptyOutputData: OutputData = {
  items: [],
  count: 0,
};

export const outputData: OutputData = {
  items: [
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
  ],
  count: 2,
};
