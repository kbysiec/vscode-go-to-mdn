import * as vscode from "vscode";
const open = require("open");
import QuickPick from "./quickPick";
import QuickPickItem from "./interfaces/quickPickItem";
import Utils from "./utils";
import Cache from "./cache";
import Config from "./config";
import DataService from "./dataService";

class ExtensionController {
  private higherLevelData: QuickPickItem[][];
  private quickPick: QuickPick;
  private cache: Cache;
  private utils: Utils;
  private config: Config;
  private dataService: DataService;

  constructor(private extensionContext: vscode.ExtensionContext) {
    this.cache = new Cache(this.extensionContext);
    this.utils = new Utils();
    this.config = new Config();
    this.dataService = new DataService(this.cache, this.utils, this.config);
    this.quickPick = new QuickPick(
      this.onQuickPickSubmit,
      this.config.shouldDisplayFlatList()
    );
    this.higherLevelData = [];

    this.dataService.onWillGoLowerTreeLevel(this.onWillGoLowerTreeLevel);
  }

  async showQuickPick(): Promise<void> {
    await this.loadQuickPickData();
    this.quickPick.show();
  }

  clearCache(): void {
    this.cache.clearCache();
  }

  private onQuickPickSubmit = async (
    value: QuickPickItem | string
  ): Promise<void> => {
    try {
      let url: string;
      if (this.utils.isValueStringType(value)) {
        if (!this.dataService.isHigherLevelDataEmpty()) {
          return;
        }
        value = value as string;
        url = this.utils.getSearchUrl(value);
        url && (await this.openInBrowser(url));
      } else {
        value = value as QuickPickItem;

        if (this.utils.isValueFileType(value)) {
          let url = value.url;
          url && (await this.openInBrowser(url));
        } else {
          this.loadQuickPickData(value);
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
    }
  };

  private async loadQuickPickData(value?: QuickPickItem): Promise<void> {
    this.quickPick.showLoading(true);
    let data: QuickPickItem[];

    if (this.config.shouldDisplayFlatList()) {
      data = await this.dataService.getFlatQuickPickData();
    } else if (value) {
      data = await this.dataService.getQuickPickData(value);
    } else {
      data = await this.dataService.getQuickPickRootData();
    }
    this.prepareQuickPickPlaceholder();

    this.quickPick.clearText();
    this.quickPick.loadItems(data);
    this.quickPick.showLoading(false);
  }

  private prepareQuickPickPlaceholder(): void {
    this.higherLevelData.length
      ? this.clearQuickPickPlaceholder()
      : this.setQuickPickPlaceholder();
  }

  private setQuickPickPlaceholder(): void {
    this.quickPick.setPlaceholder(
      "choose item from the list or type anything to search"
    );
  }

  private clearQuickPickPlaceholder(): void {
    this.quickPick.setPlaceholder(undefined);
  }

  private async openInBrowser(url: string): Promise<void> {
    await open(url);
  }

  private onWillGoLowerTreeLevel = () => {
    const qpData = this.quickPick.getItems();
    this.dataService.rememberHigherLevelQpData(qpData);
  };
}

export default ExtensionController;
