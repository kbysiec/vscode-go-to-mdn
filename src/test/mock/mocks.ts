import { OutputData } from "../../interface/outputData";
import QuickPickItem from "../../interface/quickPickItem";

export const emptyOutputData: OutputData = {
  items: [],
  count: 0,
};

export const outputData: OutputData = {
  items: [
    {
      name: "sub-label",
      url: "https://developer.mozilla.org/docs/api/test-label/sub-label",
      breadcrumbs: ["api", "test-label", "sub-label"],
    },
    {
      name: "sub-label-2",
      url: "https://developer.mozilla.org/docs/api/test-label/sub-label-2",
      breadcrumbs: ["api", "test-label", "sub-label-2"],
    },
  ],
  count: 2,
};

export const parserInput: any = {
  prop1: {
    __compat: {
      mdn_url: "https://developer.mozilla.org/docs/api/test-label/sub-label",
    },
  },
  prop2: {
    __compat: {
      mdn_url: "https://developer.mozilla.org/docs/api/test-label/sub-label-2",
    },
  },
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
