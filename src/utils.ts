import * as vscode from "vscode";
import { appConfig } from "./appConfig";
import ItemType from "./enum/itemType";
import QuickPickItem from "./interface/quickPickItem";

class Utils {
  isValueStringType(value: QuickPickItem | string): boolean {
    return typeof value === "string";
  }

  isValueFileType(value: QuickPickItem): boolean {
    return value.type === ItemType.File;
  }

  getSearchUrl(value: string): string {
    const queryString = value.split(" ").join("+");
    return `${appConfig.searchUrl}?q=${queryString}`;
  }

  getNameFromQuickPickItem(item: QuickPickItem): string {
    return item.label.split(" ").slice(1).join(" ");
  }

  removeDataWithEmptyUrl(data: QuickPickItem[]): QuickPickItem[] {
    return data.filter((element) => element.url);
  }

  printErrorMessage(error: Error): void {
    vscode.window.showInformationMessage(
      `Something went wrong... Extension encountered the following error: ${error.message}`
    );
  }

  printClearCacheMessage(): void {
    vscode.window.showInformationMessage("Go to MDN extension: cache cleared");
  }
}

export default Utils;
