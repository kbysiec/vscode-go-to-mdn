import * as vscode from "vscode";
import Cache from "./cache";
import QuickPick from "./quickPick";
import Utils from "./utils";

class ExtensionController {
  private cache: Cache;
  private quickPick: QuickPick;
  private utils: Utils;

  constructor(private extensionContext: vscode.ExtensionContext) {
    this.utils = new Utils();
    this.cache = new Cache(this.extensionContext);

    this.quickPick = new QuickPick(this.cache, this.utils);
    this.quickPick.registerEventListeners();
  }

  async browse(): Promise<void> {
    await this.quickPick.loadQuickPickData();
    this.quickPick.show();
  }

  clearCache(): void {
    this.cache.clearCache();
    this.utils.printClearCacheMessage();
  }
}

export default ExtensionController;
