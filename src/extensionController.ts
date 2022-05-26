import * as vscode from "vscode";
import { clearCache, initCache } from "./cache";
import QuickPick from "./quickPick";
import { printClearCacheMessage } from "./utils";

class ExtensionController {
  private quickPick: QuickPick;

  constructor(extensionContext: vscode.ExtensionContext) {
    initCache(extensionContext);

    this.quickPick = new QuickPick();
    this.quickPick.registerEventListeners();
  }

  async browse(): Promise<void> {
    await this.quickPick.loadQuickPickData();
    this.quickPick.show();
  }

  clearCache(): void {
    clearCache();
    printClearCacheMessage();
  }
}

export default ExtensionController;
