import * as vscode from "vscode";
import QuickPickExtendedItem from "./interfaces/quickPickExtendedItem";
import Item from "./interfaces/item";
import ItemType from "./enums/itemType";
import { config } from './config';

export function getConfiguration<T>(section: string, defaultValue: T): T {
  const config = vscode.workspace.getConfiguration("");
  return config.get<T>(section, defaultValue);
}

export function isValueStringType(value: QuickPickExtendedItem | string): boolean {
  return typeof value === "string";
}

export function isValueFileType(value: QuickPickExtendedItem): boolean {
  return value.type === ItemType.File;
}

export function getSearchUrl(value: string): string {
  const queryString = value.split(" ").join("+");
  const url = `${config.searchUrl}?q=${queryString}`;
  return url;
}

export function getNameFromQuickPickItem(item: QuickPickExtendedItem): string {
  return item.label
    .split(" ")
    .slice(1)
    .join(" ");
}

export function removeDataWithEmptyUrl(
  data: QuickPickExtendedItem[]
): QuickPickExtendedItem[] {
  return data.filter(element => element.url);
}

export function mapDataToQpData(data: Item[], isFlat: boolean = false): QuickPickExtendedItem[] {
  return data.map(el => {
    const icon =
      el.type === ItemType.Directory ? "$(file-directory)" : "$(link)";
    const description = isFlat ? el.breadcrumbs.join(" ") : undefined;
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

export function mapQpItemToItem(qpItem: QuickPickExtendedItem): Item {
  return {
    name: getNameFromQuickPickItem(qpItem),
    url: qpItem.url,
    type: qpItem.type,
    parent: qpItem.parent,
    rootParent: qpItem.rootParent,
    breadcrumbs: qpItem.breadcrumbs
  };
}

export function addBackwardNavigationItem(
  data: Item[],
  qpData: QuickPickExtendedItem[]
): void {
  if (data.length) {
    data[0].parent &&
      qpData.unshift({
        label: `$(file-directory) ${config.higherLevelLabel}`,
        description: data.length ? prepareBreadcrumbs(data[0]) : "",
        type: ItemType.Directory,
        url: "#",
        breadcrumbs: []
      });
  }
}

export function prepareBreadcrumbs(item: Item): string {
  const breadcrumbs = [...item.breadcrumbs].slice(0, -1);
  return breadcrumbs.join(" / ");
}

export function prepareQpData(data: Item[]): QuickPickExtendedItem[] {
  const shouldDisplayFlatListFlag = shouldDisplayFlatList();
  const qpData: QuickPickExtendedItem[] = mapDataToQpData(data, shouldDisplayFlatListFlag);
  !shouldDisplayFlatListFlag && addBackwardNavigationItem(data, qpData);
  return qpData;
}

export function shouldDisplayFlatList(): boolean {
  return getConfiguration<boolean>(
    "goToMDN.shouldDisplayFlatList",
    false
  );
}

export function getToken(): string {
  return getConfiguration<string>(
    "goToMDN.githubPersonalAccessToken",
    ""
  );
}
