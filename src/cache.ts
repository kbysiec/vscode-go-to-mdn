import * as vscode from "vscode";
import { appConfig } from "./appConfig";
import { InputData } from "./interface/inputData";

let extensionContext: vscode.ExtensionContext;

export function initCache(context: vscode.ExtensionContext) {
  extensionContext = context;
}

export function updateDataInCache(data: InputData): void {
  extensionContext.globalState.update(appConfig.cacheKey, data);
}

export function getDataFromCache(): InputData {
  const data: any = extensionContext.globalState.get(appConfig.cacheKey);

  return data || { items: [], count: 0 };
}

export function clearCache(): void {
  extensionContext.globalState.update(appConfig.cacheKey, []);
}
