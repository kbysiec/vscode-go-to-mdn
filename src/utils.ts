import QuickPickItem from "./interfaces/quickPickItem";
import ItemType from "./enums/itemType";
import { appConfig } from "./appConfig";

class Utils {
  isValueStringType(value: QuickPickItem | string): boolean {
    return typeof value === "string";
  }

  isValueFileType(value: QuickPickItem): boolean {
    return value.type === ItemType.File;
  }

  getSearchUrl(value: string): string {
    const queryString = value.split(" ").join("+");
    const url = `${appConfig.searchUrl}?q=${queryString}`;
    return url;
  }

  getNameFromQuickPickItem(item: QuickPickItem): string {
    return item.label.split(" ").slice(1).join(" ");
  }

  removeDataWithEmptyUrl(data: QuickPickItem[]): QuickPickItem[] {
    return data.filter((element) => element.url);
  }
}

export default Utils;
