import * as vscode from "vscode";
import QuickPickExtendedItem from "./interfaces/quickPickExtendedItem";
import Item from "./interfaces/item";
import ItemType from "./enums/itemType";
import { appConfig } from "./appConfig";

class Utils {
  isValueStringType(value: QuickPickExtendedItem | string): boolean {
    return typeof value === "string";
  }

  isValueFileType(value: QuickPickExtendedItem): boolean {
    return value.type === ItemType.File;
  }

  getSearchUrl(value: string): string {
    const queryString = value.split(" ").join("+");
    const url = `${appConfig.searchUrl}?q=${queryString}`;
    return url;
  }

  getNameFromQuickPickItem(item: QuickPickExtendedItem): string {
    return item.label.split(" ").slice(1).join(" ");
  }

  removeDataWithEmptyUrl(
    data: QuickPickExtendedItem[]
  ): QuickPickExtendedItem[] {
    return data.filter((element) => element.url);
  }

  getConfiguration<T>(section: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration("");
    return config.get<T>(section, defaultValue);
  }

  getToken(): string {
    return this.getConfiguration<string>(
      "goToMDN.githubPersonalAccessToken",
      ""
    );
  }

  shouldDisplayFlatList(): boolean {
    return this.getConfiguration<boolean>(
      "goToMDN.shouldDisplayFlatList",
      false
    );
  }
}

export default Utils;
