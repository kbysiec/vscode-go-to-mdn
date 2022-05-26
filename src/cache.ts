import * as vscode from "vscode";
import { appConfig } from "./appConfig";
import Item from "./interface/item";
import QuickPickItem from "./interface/quickPickItem";

let extensionContext: vscode.ExtensionContext;

export function initCache(context: vscode.ExtensionContext) {
  extensionContext = context;
}

export function updateFlatData(data: Item[]): void {
  extensionContext.globalState.update(appConfig.flatCacheKey, data);
}

export function updateTreeDataByItem(data: Item[], item?: Item): void {
  let cache: any =
    extensionContext.globalState.get(appConfig.treeCacheKey) || {};

  const key = item ? item.url : appConfig.rootUrl;
  cache[key] = data;
  extensionContext.globalState.update(appConfig.treeCacheKey, cache);
}

export function getFlatData(): Item[] | undefined {
  const data: any = extensionContext.globalState.get(appConfig.flatCacheKey);

  return data && data.length ? data : [];
}

export function getTreeDataByItem(item?: QuickPickItem): Item[] | undefined {
  const cache: any = extensionContext.globalState.get(appConfig.treeCacheKey);
  const key = item ? item.url : appConfig.rootUrl;

  return cache ? cache[key] : [];
}

export function clearCache(): void {
  extensionContext.globalState.update(appConfig.flatCacheKey, []);
  extensionContext.globalState.update(appConfig.treeCacheKey, {});
}
