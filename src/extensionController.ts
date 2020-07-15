import * as vscode from "vscode";
const open = require("open");
import DataService from "./dataService";
import QuickPick from "./quickPick";
import Item from "./interfaces/item";
import QuickPickItem from "./interfaces/quickPickItem";
import Utils from "./utils";
import { appConfig } from "./appConfig";
import Cache from "./cache";
import DataConverter from "./dataConverter";

class ExtensionController {
  private dataService: DataService;
  private dataConverter: DataConverter;
  private higherLevelData: QuickPickItem[][];
  private quickPick: QuickPick;
  private cache: Cache;
  private utils: Utils;

  constructor(private extensionContext: vscode.ExtensionContext) {
    this.utils = new Utils();
    this.dataService = new DataService(this.utils);
    this.dataConverter = new DataConverter(this.utils);
    this.quickPick = new QuickPick(
      this.onQuickPickSubmit,
      this.utils.shouldDisplayFlatList()
    );
    this.higherLevelData = [];
    this.cache = new Cache(this.extensionContext);
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
        if (!this.isHigherLevelDataEmpty()) {
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

  private async getFlatFilesData(progress: any): Promise<void> {
    progress &&
      progress.report({
        increment: 30,
      });

    await this.downloadFlatFilesData();

    progress &&
      progress.report({
        increment: 70,
      });
  }

  private async cacheFlatFilesWithProgressTask(progress: any) {
    await this.cacheFlatFilesData(progress);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 250);
    });
  }

  private async cacheFlatFilesWithProgress() {
    const dataFromCache = this.cache.getFlatData();
    const areCached = dataFromCache ? dataFromCache.length > 0 : false;

    if (
      this.utils.shouldDisplayFlatList() &&
      this.utils.getToken() &&
      !areCached
    ) {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Downloading and indexing data for MDN...",
          cancellable: false,
        },
        this.cacheFlatFilesWithProgressTask.bind(this)
      );
    }
  }

  private async cacheFlatFilesData(progress: any) {
    await this.getFlatFilesData(progress);
  }

  private isHigherLevelDataEmpty(): boolean {
    return !this.higherLevelData.length;
  }

  private async loadQuickPickData(value?: QuickPickItem): Promise<void> {
    this.quickPick.showLoading(true);
    let data: QuickPickItem[];

    if (this.utils.shouldDisplayFlatList()) {
      data = await this.getFlatQuickPickData();
    } else if (value) {
      data = await this.getQuickPickData(value);
    } else {
      data = await this.getQuickPickRootData();
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

  private async getFlatQuickPickData(): Promise<QuickPickItem[]> {
    let data = this.cache.getFlatData();
    const areCached = data ? data.length > 0 : false;

    if (!areCached) {
      await this.cacheFlatFilesWithProgress();
      data = this.cache.getFlatData();
    }

    const qpData = data ? this.dataConverter.prepareQpData(data) : [];
    return qpData;
  }

  private async getQuickPickRootData(): Promise<QuickPickItem[]> {
    return await this.getTreeData();
  }

  private async getQuickPickData(
    value: QuickPickItem
  ): Promise<QuickPickItem[]> {
    let data: QuickPickItem[];
    const name = this.utils.getNameFromQuickPickItem(value);
    if (name === appConfig.higherLevelLabel) {
      data = this.getHigherLevelQpData();
    } else {
      data = await this.getLowerLevelQpData(value);
      this.rememberHigherLevelQpData();
    }
    return data;
  }

  private rememberHigherLevelQpData(): void {
    const qpData = this.quickPick.getItems();
    qpData.length && this.higherLevelData.push(qpData);
  }

  private getHigherLevelQpData(): QuickPickItem[] {
    return this.higherLevelData.pop() as QuickPickItem[];
  }

  private async getLowerLevelQpData(
    value: QuickPickItem
  ): Promise<QuickPickItem[]> {
    let data: QuickPickItem[];
    data = await this.getTreeData(value);
    data = this.utils.removeDataWithEmptyUrl(data);
    return data;
  }

  private setQuickPickPlaceholder(): void {
    this.quickPick.setPlaceholder(
      "choose item from the list or type anything to search"
    );
  }

  private clearQuickPickPlaceholder(): void {
    this.quickPick.setPlaceholder(undefined);
  }

  private async getTreeData(qpItem?: QuickPickItem): Promise<QuickPickItem[]> {
    let data = this.cache.getTreeDataByItem(qpItem);

    if (!data || !data.length) {
      let item: Item | undefined =
        qpItem && this.dataConverter.mapQpItemToItem(qpItem);
      data = await this.downloadTreeData(item);
    }
    const qpData = this.dataConverter.prepareQpData(data);
    return qpData;
  }

  private async downloadTreeData(item?: Item): Promise<Item[]> {
    const data = await this.dataService.downloadTreeData(item);
    this.cache.updateTreeDataByItem(data, item);
    return data;
  }

  private async downloadFlatFilesData(): Promise<Item[]> {
    const data = await this.dataService.downloadFlatData();
    this.cache.updateFlatData(data);
    return data;
  }

  private async openInBrowser(url: string): Promise<void> {
    await open(url);
  }
}

export default ExtensionController;
