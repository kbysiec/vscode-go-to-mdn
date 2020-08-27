import Item from "../../interfaces/item";
import ItemType from "../../enums/itemType";

export const downloadTreeDataRootDirectoriesContent: string = `{
  "name": "README.md",
  "type": "file",
  "content": "KlBsZWFzZSBub3RlIHRoYXQgd2UgaGF2ZSBub3QgKHlldCkgbWlncmF0ZWQgYWxsIGNvbXBhdGliaWxpdHkgZGF0YSBmcm9tIHRoZSBNRE4gd2lraSBwYWdlcyBpbnRvIHRoaXMgcmVwb3NpdG9yeS4qCiAgICAgIC0gW2xhYmVsL10oaHR0cHM6Ly9naXRodWIuY29tL21kbi9icm93c2VyLWNvbXBhdC1kYXRhL3RyZWUvbWFzdGVyL2xhYmVsKSBjb250YWlucyBkYXRhIGZvciBlYWNoIFdlYiBBUEkgaW50ZXJmYWNlLgogICAgICAtIFtjYXRlZ29yeS9dKGh0dHBzOi8vZ2l0aHViLmNvbS9tZG4vYnJvd3Nlci1jb21wYXQtZGF0YS90cmVlL21hc3Rlci9jYXRlZ29yeSkgY29udGFpbnMgZGF0YSBmb3IgQ1NTIHByb3BlcnRpZXMsIHNlbGVjdG9ycywgYW5kIGF0LXJ1bGVzLgogICAgICBbSFRNTF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRNTCkgZWxlbWVudHMsIGF0dHJpYnV0ZXMsIGFuZCBnbG9iYWwgYXR0cmlidXRlcy4KICAgICAgIyMgRm9ybWF0IG9mIHRoZSBicm93c2VyIGNvbXBhdCBqc29uIGZpbGVz",
  "encoding": "base64"
}`;

export const downloadTreeDataElementsContent: string = `{
  "name": "README.md",
  "type": "file",
  "content": "ewogICAgICAgICJ3ZWJkcml2ZXIiOiB7CiAgICAgICAgICAiY29tbWFuZHMiOiB7CiAgICAgICAgICAgICJBY2NlcHRBbGVydCI6IHsKICAgICAgICAgICAgICAiX19jb21wYXQiOiB7CiAgICAgICAgICAgICAgICAibWRuX3VybCI6ICJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9XZWJEcml2ZXIvQ29tbWFuZHMvQWNjZXB0QWxlcnQiLAogICAgICAgICAgICAgICAgInN1cHBvcnQiOiB7CiAgICAgICAgICAgICAgICAgICJjaHJvbWUiOiB7CiAgICAgICAgICAgICAgICAgICAgInZlcnNpb25fYWRkZWQiOiAiNjUiCiAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAic3RhdHVzIjogewogICAgICAgICAgICAgICAgICAiZXhwZXJpbWVudGFsIjogZmFsc2UKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICJzY2hlbWUiOiB7CiAgICAgICAgICAgICAgICAid2lsZGNhcmQiOiB7CiAgICAgICAgICAgICAgICAgICJfX2NvbXBhdCI6IHsKICAgICAgICAgICAgICAgICAgICAiZGVzY3JpcHRpb24iOiAiV2lsZGNhcmQgPGNvZGU+KjwvY29kZT4gc2NoZW1lIgogICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9",
  "encoding": "base64"
}`;

export const downloadTreeDataElementsItem: Item = {
  name: "Accept Alert",
  url:
    "https://api.github.com/repos/mdn/browser-compat-data/contents/webdriver/commands/AcceptAlert.json?ref=master",
  type: ItemType.Directory,
  parent: {
    name: "commands",
    url:
      "https://api.github.com/repos/mdn/browser-compat-data/contents/webdriver/commands?ref=master",
    type: ItemType.Directory,
    parent: undefined,
    rootParent: undefined,
    breadcrumbs: ["webdriver", "commands"],
  },
  rootParent: undefined,
  breadcrumbs: ["webdriver", "commands", "Accept Alert"],
};

export const downloadTreeDataDirectoriesContent: string = `[
  {
    "name": "AbortController.json",
    "url": "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortController.json?ref=master",
    "type": "file"
  },
  {
    "name": "AbortPaymentEvent.json",
    "url": "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortPaymentEvent.json?ref=master",
    "type": "file"
  }
]`;

export const downloadTreeDataDirectoriesItem: Item = {
  name: "api",
  url:
    "https://api.github.com/repos/mdn/browser-compat-data/contents/api?ref=master",
  type: ItemType.Directory,
  breadcrumbs: ["api"],
};

export const downloadTreeDataDirectoriesOutputItems: Item[] = [
  {
    name: "label",
    url:
      "https://api.github.com/repos/mdn/browser-compat-data/contents/label?ref=master",
    type: ItemType.Directory,
    breadcrumbs: ["label"],
  },
  {
    name: "category",
    url:
      "https://api.github.com/repos/mdn/browser-compat-data/contents/category?ref=master",
    type: ItemType.Directory,
    breadcrumbs: ["category"],
  },
];
