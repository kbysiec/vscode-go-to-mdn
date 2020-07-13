import * as vscode from "vscode";
import Item from "./interfaces/item";
import QuickPickExtendedItem from "./interfaces/quickPickExtendedItem";
import { appConfig } from "./appConfig";

class Cache {
  constructor(private extensionContext: vscode.ExtensionContext) {}

  updateFlatFilesListCache(data: Item[]): void {
    let cache: any = this.extensionContext.globalState.get(
      appConfig.filesCacheKey
    );
    if (!cache) {
      cache = {};
    }

    cache["files"] = data;

    this.extensionContext.globalState.update(appConfig.filesCacheKey, cache);
  }

  updateTreeItemsByUrlFromCache(data: Item[], item?: Item): void {
    let cache: any = this.extensionContext.globalState.get(appConfig.cacheKey);
    if (!cache) {
      cache = {};
    }

    const key = item ? item.url : appConfig.rootUrl;
    cache[key] = data;
    this.extensionContext.globalState.update(appConfig.cacheKey, cache);
  }

  getFlatFilesFromCache(): Item[] | undefined {
    const cache: any = this.extensionContext.globalState.get(
      appConfig.filesCacheKey
    );
    let cachedData = [];
    if (cache) {
      const key = "files";
      cachedData = cache[key];
    }
    return cachedData;
  }

  getTreeItemsByUrlFromCache(item?: QuickPickExtendedItem): Item[] | undefined {
    const cache: any = this.extensionContext.globalState.get(
      appConfig.cacheKey
    );
    let cachedData = [];
    if (cache) {
      const key = item ? item.url : appConfig.rootUrl;
      cachedData = cache[key];
    }
    return cachedData;
  }

  clearCache(): void {
    this.extensionContext.globalState.update(appConfig.filesCacheKey, {});
    this.extensionContext.globalState.update(appConfig.cacheKey, {});
  }
}

export default Cache;
