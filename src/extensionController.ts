import * as vscode from "vscode";
const open = require("open");
import DataService from "./dataService";
import QuickPick from "./quickPick";
import Item from "./interfaces/item";
import QuickPickExtendedItem from "./interfaces/quickPickExtendedItem";
import { getConfiguration, isValueStringType, isValueFileType, getSearchUrl, getNameFromQuickPickItem, mapDataToQpData, mapQpItemToItem, addBackwardNavigationItem, removeDataWithEmptyUrl, prepareQpData, shouldDisplayFlatList, getToken } from "./utils";
import { config } from './config';
import Cache from './cache';

class ExtensionController {
  private dataService: DataService;
  private higherLevelData: QuickPickExtendedItem[][];
  private quickPick: QuickPick;
  private cache: Cache;

  constructor(private extensionContext: vscode.ExtensionContext) {
    this.dataService = new DataService();
    this.quickPick = new QuickPick(this.onQuickPickSubmit, shouldDisplayFlatList());
    this.higherLevelData = [];
    this.cache = new Cache(this.extensionContext);
  }

  onQuickPickSubmit = async (
    value: QuickPickExtendedItem | string
  ): Promise<void> => {
    try {
      let url: string;
      if (isValueStringType(value)) {
        if (!this.isHigherLevelDataEmpty()) {
          return;
        }
        value = value as string;
        url = getSearchUrl(value);
        url && (await this.openInBrowser(url));
      } else {
        value = value as QuickPickExtendedItem;

        if (isValueFileType(value)) {
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

  async showQuickPick(): Promise<void> {
    await this.loadQuickPickData();
    this.quickPick.show();
  }

  hideQuickPick(): void {
    this.quickPick.hide();
  }

  async getFlatFilesData(
    progress: any
  ): Promise<void> {
    progress &&
      progress.report({
        increment: 30
      });

    await this.downloadFlatFilesData();

    progress &&
      progress.report({
        increment: 70
      });
  }

  async cacheFlatFilesWithProgress() {
    const dataFromCache = this.cache.getFlatFilesFromCache();
    const areCached = dataFromCache ? dataFromCache.length > 0 : false;

    if (shouldDisplayFlatList() && getToken() && !areCached) {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Downloading and indexing data for MDN...",
          cancellable: false
        },
        async (progress: any) => {
          await this.cacheFlatFilesData(progress);
          await new Promise(resolve => {
            setTimeout(() => {
              resolve();
            }, 250);
          });
        }
      );
    }
  }

  async cacheFlatFilesData(progress: any) {
    await this.getFlatFilesData(
      progress
    );
  }

  clearCache(): void {
    this.cache.clearCache();
  }

  private isHigherLevelDataEmpty(): boolean {
    return !this.higherLevelData.length;
  }

  private async loadQuickPickData(
    value?: QuickPickExtendedItem
  ): Promise<void> {
    this.quickPick.showLoading(true);
    let data: QuickPickExtendedItem[];

    if (shouldDisplayFlatList()) {
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

  private async getFlatQuickPickData(): Promise<QuickPickExtendedItem[]> {
    let data = this.cache.getFlatFilesFromCache();
    const areCached = data ? data.length > 0 : false;

    if (!areCached) {
      await this.cacheFlatFilesWithProgress();
      data = this.cache.getFlatFilesFromCache();
    }

    const qpData = data ? prepareQpData(data) : [];
    return qpData;
  }

  private async getQuickPickRootData(): Promise<QuickPickExtendedItem[]> {
    return await this.getTreeData();
  }

  private async getQuickPickData(
    value: QuickPickExtendedItem
  ): Promise<QuickPickExtendedItem[]> {
    let data: QuickPickExtendedItem[];
    const name = getNameFromQuickPickItem(value);
    if (name === config.higherLevelLabel) {
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

  private getHigherLevelQpData(): QuickPickExtendedItem[] {
    return this.higherLevelData.pop() as QuickPickExtendedItem[];
  }

  private async getLowerLevelQpData(
    value: QuickPickExtendedItem
  ): Promise<QuickPickExtendedItem[]> {
    let data: QuickPickExtendedItem[];
    data = await this.getTreeData(value);
    data = removeDataWithEmptyUrl(data);
    return data;
  }

  private setQuickPickPlaceholder(): void {
    this.quickPick.setPlaceholder(
      "choose category from the list or type anything to search"
    );
  }

  private clearQuickPickPlaceholder(): void {
    this.quickPick.setPlaceholder(undefined);
  }

  private async getTreeData(
    qpItem?: QuickPickExtendedItem
  ): Promise<QuickPickExtendedItem[]> {
    let data = this.cache.getTreeItemsByUrlFromCache(qpItem);

    if (!data || !data.length) {
      let item: Item | undefined = qpItem && mapQpItemToItem(qpItem);
      data = await this.downloadTreeData(item);
    }
    const qpData = prepareQpData(data);
    return qpData;
  }

  private async downloadTreeData(item?: Item): Promise<Item[]> {
    const data = await this.dataService.downloadTreeData(item);
    this.cache.updateTreeItemsByUrlFromCache(data, item);
    return data;
  }

  private async downloadFlatFilesData(): Promise<Item[]> {
    const data = await this.dataService.downloadFlatData();
    this.cache.updateFlatFilesListCache(data);
    return data;
  }

  private async openInBrowser(url: string): Promise<void> {
    await open(url);
  }
}

export default ExtensionController;
