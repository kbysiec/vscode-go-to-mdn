import * as vscode from "vscode";
import { appConfig } from "./appConfig";
import Cache from "./cache";
import Config from "./config";
import DataConverter from "./dataConverter";
import DataDownloader from "./dataDownloader";
import Item from "./interface/item";
import QuickPickItem from "./interface/quickPickItem";
import { getNameFromQuickPickItem, removeDataWithEmptyUrl } from "./utils";

class DataService {
  private dataDownloader: DataDownloader;
  private dataConverter: DataConverter;

  private higherLevelData: QuickPickItem[][];

  private onWillGoLowerTreeLevelEventEmitter: vscode.EventEmitter<void> =
    new vscode.EventEmitter();
  readonly onWillGoLowerTreeLevel: vscode.Event<void> =
    this.onWillGoLowerTreeLevelEventEmitter.event;

  constructor(private cache: Cache, private config: Config) {
    this.dataDownloader = new DataDownloader(this.config);
    this.dataConverter = new DataConverter(this.config);

    this.higherLevelData = [];
  }

  async getFlatQuickPickData(): Promise<QuickPickItem[]> {
    let data = this.cache.getFlatData();
    const areCached = data ? data.length > 0 : false;

    if (!areCached) {
      await this.cacheFlatFilesWithProgress();
      data = this.cache.getFlatData();
    }

    return data ? this.dataConverter.prepareQpData(data) : [];
  }

  async getQuickPickRootData(): Promise<QuickPickItem[]> {
    return await this.getTreeData(true);
  }

  async getQuickPickData(value: QuickPickItem): Promise<QuickPickItem[]> {
    let data: QuickPickItem[];
    const name = getNameFromQuickPickItem(value);
    if (name === appConfig.higherLevelLabel) {
      data = this.getHigherLevelQpData();
    } else {
      data = await this.getLowerLevelQpData(value);
      this.onWillGoLowerTreeLevelEventEmitter.fire();
    }
    return data;
  }

  rememberHigherLevelQpData(items: QuickPickItem[]): void {
    items.length && this.higherLevelData.push(items);
  }

  isHigherLevelDataEmpty(): boolean {
    return !this.higherLevelData.length;
  }

  private getHigherLevelQpData(): QuickPickItem[] {
    return this.higherLevelData.pop() as QuickPickItem[];
  }

  private async getLowerLevelQpData(
    value: QuickPickItem
  ): Promise<QuickPickItem[]> {
    let data = await this.getTreeData(false, value);
    data = removeDataWithEmptyUrl(data);
    return data;
  }

  private async getTreeData(
    isRootLevel: boolean,
    qpItem?: QuickPickItem
  ): Promise<QuickPickItem[]> {
    let data = this.cache.getTreeDataByItem(qpItem);

    if (!data || !data.length) {
      let item = qpItem && this.dataConverter.mapQpItemToItem(qpItem);
      data = await this.downloadTreeData(item);
    }
    return this.dataConverter.prepareQpData(data, isRootLevel);
  }

  private async downloadTreeData(item?: Item): Promise<Item[]> {
    const data = await this.dataDownloader.downloadTreeData(item);
    this.cache.updateTreeDataByItem(data, item);
    return data;
  }

  private async downloadFlatFilesData(): Promise<Item[]> {
    const data = await this.dataDownloader.downloadFlatData();
    this.cache.updateFlatData(data);
    return data;
  }

  private async getFlatFilesData(
    progress: vscode.Progress<{
      message?: string | undefined;
      increment?: number | undefined;
    }>
  ): Promise<void> {
    progress &&
      progress.report({
        increment: 40,
      });

    await this.downloadFlatFilesData();

    progress &&
      progress.report({
        increment: 60,
      });
  }

  private async cacheFlatFilesWithProgress() {
    if (this.config.shouldDisplayFlatList()) {
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

  private async cacheFlatFilesWithProgressTask(
    progress: vscode.Progress<{
      message?: string | undefined;
      increment?: number | undefined;
    }>
  ) {
    await this.getFlatFilesData(progress);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 250);
    });
  }
}

export default DataService;
