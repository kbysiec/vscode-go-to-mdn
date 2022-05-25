import * as vscode from "vscode";
import Cache from "./cache";
import QuickPick from "./quickPick";
import { printClearCacheMessage } from "./utils";

class ExtensionController {
  private cache: Cache;
  private quickPick: QuickPick;

  constructor(private extensionContext: vscode.ExtensionContext) {
    this.cache = new Cache(this.extensionContext);

    this.quickPick = new QuickPick(this.cache);
    this.quickPick.registerEventListeners();
  }

  async browse(): Promise<void> {
    await this.quickPick.loadQuickPickData();
    this.quickPick.show();
  }

  clearCache(): void {
    this.cache.clearCache();
    printClearCacheMessage();
  }
}

export default ExtensionController;
