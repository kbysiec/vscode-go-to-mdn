import * as vscode from "vscode";
import QuickPick from "./quickPick";
import Cache from "./cache";

class ExtensionController {
  private quickPick: QuickPick;
  private cache: Cache;

  constructor(private extensionContext: vscode.ExtensionContext) {
    this.cache = new Cache(this.extensionContext);

    this.quickPick = new QuickPick(this.cache);
    this.quickPick.registerEventListeners();
  }

  async showQuickPick(): Promise<void> {
    await this.quickPick.loadQuickPickData();
    this.quickPick.show();
  }

  clearCache(): void {
    this.cache.clearCache();
  }
}

export default ExtensionController;
