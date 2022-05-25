import * as vscode from "vscode";
import { appConfig } from "./appConfig";
import ItemType from "./enum/itemType";
import QuickPickItem from "./interface/quickPickItem";

export function isValueStringType(value: QuickPickItem | string): boolean {
  return typeof value === "string";
}

export function isValueFileType(value: QuickPickItem): boolean {
  return value.type === ItemType.File;
}

export function getSearchUrl(value: string): string {
  const queryString = value.split(" ").join("+");
  return `${appConfig.searchUrl}?q=${queryString}`;
}

export function getNameFromQuickPickItem(item: QuickPickItem): string {
  return item.label.split(" ").slice(1).join(" ");
}

export function removeDataWithEmptyUrl(data: QuickPickItem[]): QuickPickItem[] {
  return data.filter((element) => element.url);
}

export function printErrorMessage(error: Error): void {
  vscode.window.showInformationMessage(
    `Something went wrong... Extension encountered the following error: ${error.message}`
  );
}

export function printClearCacheMessage(): void {
  vscode.window.showInformationMessage("Go to MDN extension: cache cleared");
}
