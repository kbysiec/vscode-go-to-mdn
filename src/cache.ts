import * as vscode from "vscode";
import { appConfig } from "./appConfig";
import Item from "./interface/item";

let extensionContext: vscode.ExtensionContext;

export function initCache(context: vscode.ExtensionContext) {
  extensionContext = context;
}

export function updateDataInCache(data: Item[]): void {
  extensionContext.globalState.update(appConfig.cacheKey, data);
}

export function getDataFromCache(): Item[] | undefined {
  const data: any = extensionContext.globalState.get(appConfig.cacheKey);

  return data && data.length ? data : [];
}

export function clearCache(): void {
  extensionContext.globalState.update(appConfig.cacheKey, []);
}
