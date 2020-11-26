import * as vscode from "vscode";
import Item from "./interfaces/item";
import QuickPickItem from "./interfaces/quickPickItem";
import { appConfig } from "./appConfig";

class Cache {
  constructor(private extensionContext: vscode.ExtensionContext) {}

  updateFlatData(data: Item[]): void {
    this.extensionContext.globalState.update(appConfig.flatCacheKey, data);
  }

  updateTreeDataByItem(data: Item[], item?: Item): void {
    let cache: any =
      this.extensionContext.globalState.get(appConfig.treeCacheKey) || {};

    const key = item ? item.url : appConfig.rootUrl;
    cache[key] = data;
    this.extensionContext.globalState.update(appConfig.treeCacheKey, cache);
  }

  getFlatData(): Item[] | undefined {
    const data: any = this.extensionContext.globalState.get(
      appConfig.flatCacheKey
    );

    return data && data.length ? data : [];
  }

  getTreeDataByItem(item?: QuickPickItem): Item[] | undefined {
    const cache: any = this.extensionContext.globalState.get(
      appConfig.treeCacheKey
    );
    const key = item ? item.url : appConfig.rootUrl;

    return cache ? cache[key] : [];
  }

  clearCache(): void {
    this.extensionContext.globalState.update(appConfig.flatCacheKey, []);
    this.extensionContext.globalState.update(appConfig.treeCacheKey, {});
  }
}

export default Cache;
