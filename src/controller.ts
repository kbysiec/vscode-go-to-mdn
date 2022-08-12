import * as vscode from "vscode";
import { clearCache, initCache } from "./cache";
import { quickPick } from "./quickPick";
import { printClearCacheMessage } from "./utils";

async function browse(): Promise<void> {
  await quickPick.loadQuickPickData();
  quickPick.showQuickPick();
}

function clear(): void {
  clearCache();
  printClearCacheMessage();
}

function init(extensionContext: vscode.ExtensionContext) {
  quickPick.init();
  initCache(extensionContext);
}

export const controller = {
  init,
  browse,
  clear,
};
