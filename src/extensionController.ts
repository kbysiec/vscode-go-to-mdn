import * as vscode from "vscode";
import { clearCache, initCache } from "./cache";
import * as quickPick from "./quickPick";
import { printClearCacheMessage } from "./utils";

async function browse(): Promise<void> {
  await extensionController.quickPick!.loadQuickPickData();
  extensionController.quickPick!.showQuickPick();
}

function clear(): void {
  clearCache();
  printClearCacheMessage();
}

type extensionController = {
  quickPick?: ReturnType<typeof quickPick.createQuickPick>;
  browse: () => Promise<void>;
  clear: () => void;
};

const extensionController: extensionController = {
  browse,
  clear,
};

export function createExtensionController(
  extensionContext: vscode.ExtensionContext
) {
  extensionController.quickPick = quickPick.createQuickPick();
  initCache(extensionContext);
  return extensionController;
}
