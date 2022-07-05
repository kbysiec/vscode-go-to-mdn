import * as vscode from "vscode";
import { appConfig } from "./appConfig";
import { OutputData } from "./types";

let extensionContext: vscode.ExtensionContext;

export function initCache(context: vscode.ExtensionContext) {
  extensionContext = context;
}

export function updateDataInCache(data: OutputData): void {
  extensionContext.globalState.update(appConfig.cacheKey, data);
}

export function getDataFromCache(): OutputData {
  const data: OutputData | undefined = extensionContext.globalState.get(
    appConfig.cacheKey
  );

  return data || { items: [], count: 0 };
}

export function clearCache(): void {
  extensionContext.globalState.update(appConfig.cacheKey, []);
}
