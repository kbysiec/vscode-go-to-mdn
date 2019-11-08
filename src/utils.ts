import * as vscode from "vscode";
import QuickPickExtendedItem from "./interfaces/quickPickExtendedItem";
import Item from "./interfaces/item";
import ItemType from "./enums/itemType";
import { config } from "./config";

export const isValueStringType = (value: QuickPickExtendedItem | string): boolean => {
  return typeof value === "string";
}

export const isValueFileType = (value: QuickPickExtendedItem): boolean => {
  return value.type === ItemType.File;
}

export const getSearchUrl = (value: string): string => {
  const queryString = value.split(" ").join("+");
  const url = `${config.searchUrl}?q=${queryString}`;
  return url;
}

export const getNameFromQuickPickItem = (item: QuickPickExtendedItem): string => {
  return item.label
    .split(" ")
    .slice(1)
    .join(" ");
}

export const removeDataWithEmptyUrl = (
  data: QuickPickExtendedItem[]
): QuickPickExtendedItem[] => {
  return data.filter(element => element.url);
}

export const prepareBreadcrumbs = (item: Item | QuickPickExtendedItem, isFlat: boolean = false): string => {
  const breadcrumbs = isFlat ? item.breadcrumbs : [...item.breadcrumbs].slice(0, -1);
  return breadcrumbs.join(`${isFlat ? " " : " / "}`);
}

export const mapDataToQpData = (data: Item[], isFlat: boolean = false): QuickPickExtendedItem[] => {
  return data.map(el => {
    const icon =
      el.type === ItemType.Directory ? "$(file-directory)" : "$(link)";
    const description = isFlat ? prepareBreadcrumbs(el, isFlat) : undefined;
    return {
      label: `${icon} ${el.name}`,
      url: el.url,
      parent: el.parent,
      rootParent: el.rootParent,
      type: el.type,
      breadcrumbs: el.breadcrumbs,
      description,
    };
  });
}

export const mapQpItemToItem = (qpItem: QuickPickExtendedItem): Item => {
  return {
    name: getNameFromQuickPickItem(qpItem),
    url: qpItem.url,
    type: qpItem.type,
    parent: qpItem.parent,
    rootParent: qpItem.rootParent,
    breadcrumbs: qpItem.breadcrumbs
  };
}

export const addBackwardNavigationItem = (
  qpData: QuickPickExtendedItem[]
): void => {
  qpData.unshift({
    label: `$(file-directory) ${config.higherLevelLabel}`,
    description: prepareBreadcrumbs(qpData[0]),
    type: ItemType.Directory,
    url: "#",
    breadcrumbs: []
  });
}

export const prepareQpData = (data: Item[]): QuickPickExtendedItem[] => {
  const shouldDisplayFlatListFlag = shouldDisplayFlatList();
  const qpData: QuickPickExtendedItem[] = mapDataToQpData(data, shouldDisplayFlatListFlag);
  !shouldDisplayFlatListFlag && addBackwardNavigationItem(qpData);
  return qpData;
}

export const getConfiguration = <T>(section: string, defaultValue: T): T => {
  const config = vscode.workspace.getConfiguration("");
  return config.get<T>(section, defaultValue);
};

export const shouldDisplayFlatList = (): boolean => {
  return getConfiguration<boolean>(
    "goToMDN.shouldDisplayFlatList",
    false
  );
};

export const getToken = (): string => {
  return getConfiguration<string>(
    "goToMDN.githubPersonalAccessToken",
    ""
  );
};
