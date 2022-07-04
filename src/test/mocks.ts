import { InputData } from "../interface/inputData";
import Item from "../interface/item";
import QuickPickItem from "../interface/quickPickItem";

export const emptyOutputData: InputData = {
  items: [],
  count: 0,
};

export const outputData: InputData = {
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
    url: "https://developer.mozilla.org/docs/api/test-label/sub-label",
    breadcrumbs: ["api", "test-label", "sub-label"],
    description: "api test-label sub-label",
  },
  {
    label: `$(link) sub-label-2`,
    url: "https://developer.mozilla.org/docs/api/test-label/sub-label-2",
    breadcrumbs: ["api", "test-label", "sub-label-2"],
    description: "api test-label sub-label-2",
  },
];

export const items: Item[] = [
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
];

export const qpItem: QuickPickItem = {
  label: `$(link) sub-label`,
  url: "https://developer.mozilla.org/docs/api/test-label/sub-label",
  breadcrumbs: ["api", "test-label", "sub-label"],
  description: "api test-label sub-label",
};

export const qpItemEmptyLabel: QuickPickItem = {
  label: "",
  url: "#",
  breadcrumbs: [],
};
