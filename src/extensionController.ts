import * as vscode from "vscode";
import { clearCache, initCache } from "./cache";
import { createQuickPick } from "./quickPick";
import { printClearCacheMessage } from "./utils";

class ExtensionController {
  private quickPick: ReturnType<typeof createQuickPick>;

  constructor(extensionContext: vscode.ExtensionContext) {
    initCache(extensionContext);
    this.quickPick = createQuickPick();
  }

  async browse(): Promise<void> {
    await this.quickPick.loadQuickPickData();
    this.quickPick.showQuickPick();
  }

  clearCache(): void {
    clearCache();
    printClearCacheMessage();
  }
}

export default ExtensionController;
