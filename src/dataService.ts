import * as vscode from "vscode";
import DataDownloader from "./dataDownloader";
import DataConverter from "./dataConverter";
import Utils from "./utils";
import Config from "./config";
import Cache from "./cache";
import QuickPickItem from "./interfaces/quickPickItem";
import { appConfig } from "./appConfig";
import Item from "./interfaces/item";

class DataService {
  private dataDownloader: DataDownloader;
  private dataConverter: DataConverter;

  private higherLevelData: QuickPickItem[][];

  onWillGoLowerTreeLevelEventEmitter: vscode.EventEmitter<
    void
  > = new vscode.EventEmitter();
  readonly onWillGoLowerTreeLevel: vscode.Event<void> = this
    .onWillGoLowerTreeLevelEventEmitter.event;

  constructor(
    private cache: Cache,
    private utils: Utils,
    private config: Config
  ) {
    this.dataDownloader = new DataDownloader(this.config);
    this.dataConverter = new DataConverter(this.config, this.utils);

    this.higherLevelData = [];
  }

  async getFlatQuickPickData(): Promise<QuickPickItem[]> {
    let data = this.cache.getFlatData();
    const areCached = data ? data.length > 0 : false;

    if (!areCached) {
      await this.cacheFlatFilesWithProgress();
      data = this.cache.getFlatData();
    }

    const qpData = data ? this.dataConverter.prepareQpData(data) : [];
    return qpData;
  }

  async getQuickPickRootData(): Promise<QuickPickItem[]> {
    return await this.getTreeData();
  }

  async getQuickPickData(value: QuickPickItem): Promise<QuickPickItem[]> {
    let data: QuickPickItem[];
    const name = this.utils.getNameFromQuickPickItem(value);
    if (name === appConfig.higherLevelLabel) {
      data = this.getHigherLevelQpData();
    } else {
      data = await this.getLowerLevelQpData(value);
      // this.rememberHigherLevelQpData();
      this.onWillGoLowerTreeLevelEventEmitter.fire();
    }
    return data;
  }

  rememberHigherLevelQpData(items: QuickPickItem[]): void {
    items.length && this.higherLevelData.push(items);
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
    const data = await this.dataDownloader.downloadTreeData(item);
    this.cache.updateTreeDataByItem(data, item);
    return data;
  }

  private async downloadFlatFilesData(): Promise<Item[]> {
    const data = await this.dataDownloader.downloadFlatData();
    this.cache.updateFlatData(data);
    return data;
  }

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

  isHigherLevelDataEmpty(): boolean {
    return !this.higherLevelData.length;
  }

  private async cacheFlatFilesData(progress: any) {
    await this.getFlatFilesData(progress);
  }

  private async cacheFlatFilesWithProgress() {
    const dataFromCache = this.cache.getFlatData();
    const areCached = dataFromCache ? dataFromCache.length > 0 : false;

    if (
      this.config.shouldDisplayFlatList() &&
      this.config.getGithubPersonalAccessToken() &&
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

  private async cacheFlatFilesWithProgressTask(progress: any) {
    await this.cacheFlatFilesData(progress);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 250);
    });
  }
}

export default DataService;
