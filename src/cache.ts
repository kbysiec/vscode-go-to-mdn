import * as vscode from "vscode";
import Item from "./interfaces/item";
import QuickPickExtendedItem from "./interfaces/quickPickExtendedItem";
import { config } from './config';

class Cache {
  constructor(private extensionContext: vscode.ExtensionContext) { }

  updateFlatFilesListCache(data: Item[]): void {
    let cache: any = this.extensionContext.globalState.get(
      config.filesCacheKey
    );
    if (!cache) {
      cache = {};
    }

    cache["files"] = data;

    this.extensionContext.globalState.update(config.filesCacheKey, cache);
  }

  updateTreeItemsByUrlFromCache(data: Item[], item?: Item): void {
    let cache: any = this.extensionContext.globalState.get(
      config.cacheKey
    );
    if (!cache) {
      cache = {};
    }

    const key = item ? item.url : config.rootUrl;
    cache[key] = data;
    this.extensionContext.globalState.update(config.cacheKey, cache);
  }

  getFlatFilesFromCache(): Item[] | undefined {
    const cache: any = this.extensionContext.globalState.get(
      config.filesCacheKey
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
      config.cacheKey
    );
    let cachedData = [];
    if (cache) {
      const key = item ? item.url : config.rootUrl;
      cachedData = cache[key];
    }
    return cachedData;
  }

  clearCache(): void {
    this.extensionContext.globalState.update(config.filesCacheKey, {});
    this.extensionContext.globalState.update(config.cacheKey, {});
  }
}

export default Cache;
