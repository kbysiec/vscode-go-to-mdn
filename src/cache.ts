import * as vscode from "vscode";
import Item from "./interfaces/item";
import QuickPickItem from "./interfaces/quickPickItem";
import { appConfig } from "./appConfig";

class Cache {
  constructor(private extensionContext: vscode.ExtensionContext) {}

  updateFlatData(data: Item[]): void {
    let cache: any = this.extensionContext.globalState.get(
      appConfig.flatCacheKey
    );
    if (!cache) {
      cache = {};
    }

    cache = data;

    this.extensionContext.globalState.update(appConfig.flatCacheKey, cache);
  }

  updateTreeDataByItem(data: Item[], item?: Item): void {
    let cache: any = this.extensionContext.globalState.get(
      appConfig.treeCacheKey
    );
    if (!cache) {
      cache = {};
    }

    const key = item ? item.url : appConfig.rootUrl;
    cache[key] = data;
    this.extensionContext.globalState.update(appConfig.treeCacheKey, cache);
  }

  getFlatData(): Item[] | undefined {
    const cache: any = this.extensionContext.globalState.get(
      appConfig.flatCacheKey
    );
    if (cache && cache.length) {
      return cache;
    }
    return [];
  }

  getTreeDataByItem(item?: QuickPickItem): Item[] | undefined {
    const cache: any = this.extensionContext.globalState.get(
      appConfig.treeCacheKey
    );
    let cachedData = [];
    if (cache) {
      const key = item ? item.url : appConfig.rootUrl;
      cachedData = cache[key];
    }
    return cachedData;
  }

  clearCache(): void {
    this.extensionContext.globalState.update(appConfig.flatCacheKey, []);
    this.extensionContext.globalState.update(appConfig.treeCacheKey, {});
  }
}

export default Cache;
