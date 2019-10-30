import * as vscode from "vscode";
const open = require("open");
import Config from "./interfaces/config";
import DataService from "./dataService";
import QuickPick from "./quickPick";
import Item from "./interfaces/item";
import ItemType from "./enums/itemType";
import QuickPickExtendedItem from "./interfaces/quickPickExtendedItem";
import { getConfiguration } from "./common";

class ExtensionController {
  private config: Config;
  private dataService: DataService;
  private higherLevelData: QuickPickExtendedItem[][];
  private quickPick: QuickPick;

  constructor(private extensionContext: vscode.ExtensionContext) {
    this.config = {
      regex: /https:\/\/github\.com\/mdn\/browser-compat-data\/tree\/master\/[a-zA-Z]+/gm,
      searchUrl: "https://developer.mozilla.org/en-US/search",
      rootUrl:
        "https://api.github.com/repos/mdn/browser-compat-data/contents/README.md?ref=master",
      allFilesUrl: "http://api.agileplayers.com/api/mdn-data",
      urlNormalizer: {
        from: "https://github.com/",
        to: "https://api.github.com/",
        queryString: "?ref=master"
      },
      accessProperty: "__compat",
      higherLevelLabel: "..",
      cacheKey: "cache",
      filesCacheKey: "filesCache"
    };
    this.dataService = new DataService(this.config);
    this.quickPick = new QuickPick(this.onQuickPickSubmit);
    this.higherLevelData = [];
  }

  onQuickPickSubmit = async (
    value: QuickPickExtendedItem | string
  ): Promise<void> => {
    try {
      let url: string;
      if (this.isValueStringType(value)) {
        if (!this.isHigherLevelDataEmpty()) {
          return;
        }
        value = value as string;
        url = this.getSearchUrl(value);
        url && (await this.openInBrowser(url));
      } else {
        value = value as QuickPickExtendedItem;

        if (this.isValueFileType(value)) {
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

  async getAllData(
    progress: any
  ): Promise<void> {
    progress &&
      progress.report({
        increment: 30
      });
    const data = await this.downloadFlatData();

    progress &&
      progress.report({
        increment: 70
      });
  }

  async cacheAllDataWithProgress() {
    const shouldDisplayFlatList = getConfiguration<boolean>(
      "goToMDN.shouldDisplayFlatList",
      false
    );
    const token = getConfiguration<string>(
      "goToMDN.githubPersonalAccessToken",
      ""
    );

    const dataFromCache = this.getFlatFromCache();
    const areCached = dataFromCache ? dataFromCache.length > 0 : false;

    if (shouldDisplayFlatList && token && !areCached) {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Downloading and indexing all links for MDN...",
          cancellable: false
        },
        async (progress: any) => {
          await this.cacheAllData(progress);
          await new Promise(resolve => {
            setTimeout(() => {
              resolve();
            }, 250);
          });
        }
      );
    }
  }

  async cacheAllData(progress: any) {
    await this.getAllData(
      progress
    );
  }

  private isValueStringType(value: QuickPickExtendedItem | string): boolean {
    return typeof value === "string";
  }

  private isValueFileType(value: QuickPickExtendedItem): boolean {
    return value.type === ItemType.File;
  }

  private isHigherLevelDataEmpty(): boolean {
    return !this.higherLevelData.length;
  }

  private async loadQuickPickData(
    value?: QuickPickExtendedItem
  ): Promise<void> {
    const shouldDisplayFlatList = getConfiguration<boolean>(
      "goToMDN.shouldDisplayFlatList",
      false
    );

    this.quickPick.showLoading(true);
    let data: QuickPickExtendedItem[];

    if (shouldDisplayFlatList) {
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
    let data = this.getFlatFromCache();
    const areCached = data ? data.length > 0 : false;

    if (!areCached) {
      await this.cacheAllDataWithProgress();
      data = this.getFlatFromCache();
    }

    const qpData = data ? this.prepareQpData(data) : [];
    return qpData;
  }

  private async getQuickPickRootData(): Promise<QuickPickExtendedItem[]> {
    return await this.getData();
  }

  private async getQuickPickData(
    value: QuickPickExtendedItem
  ): Promise<QuickPickExtendedItem[]> {
    let data: QuickPickExtendedItem[];
    const name = this.getNameFromQuickPickItem(value);
    if (name === this.config.higherLevelLabel) {
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
    data = await this.getData(value);
    data = this.removeDataWithEmptyUrl(data);
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

  private getSearchUrl(value: string): string {
    const queryString = value.split(" ").join("+");
    const url = `${this.config.searchUrl}?q=${queryString}`;
    return url;
  }

  private async getData(
    qpItem?: QuickPickExtendedItem
  ): Promise<QuickPickExtendedItem[]> {
    let data = this.getFromCache(qpItem);

    if (!data || !data.length) {
      let item: Item | undefined = qpItem && this.mapQpItemToItem(qpItem);
      data = await this.downloadData(item);
    }
    const qpData = this.prepareQpData(data);
    return qpData;
  }

  private mapQpItemToItem(qpItem: QuickPickExtendedItem): Item {
    return {
      name: this.getNameFromQuickPickItem(qpItem),
      url: qpItem.url,
      type: qpItem.type,
      parent: qpItem.parent,
      rootParent: qpItem.rootParent,
      breadcrumbs: qpItem.breadcrumbs
    };
  }

  private async downloadData(item?: Item): Promise<Item[]> {
    const data = await this.dataService.downloadData(item);
    this.updateCache(data, item);
    return data;
  }

  private async downloadFlatData(): Promise<Item[]> {
    const data = await this.dataService.downloadFlatData();
    this.updateFilesCache(data);
    return data;
  }

  private removeDataWithEmptyUrl(
    data: QuickPickExtendedItem[]
  ): QuickPickExtendedItem[] {
    return data.filter(element => element.url);
  }

  private getNameFromQuickPickItem(item: QuickPickExtendedItem): string {
    return item.label
      .split(" ")
      .slice(1)
      .join(" ");
  }

  private getFromCache(item?: QuickPickExtendedItem): Item[] | undefined {
    const cache: any = this.extensionContext.globalState.get(
      this.config.cacheKey
    );
    let cachedData = [];
    if (cache) {
      const key = item ? item.url : this.config.rootUrl;
      cachedData = cache[key];
    }
    return cachedData;
  }

  private updateCache(data: Item[], item?: Item): void {
    let cache: any = this.extensionContext.globalState.get(
      this.config.cacheKey
    );
    if (!cache) {
      cache = {};
    }

    const key = item ? item.url : this.config.rootUrl;
    cache[key] = data;
    this.extensionContext.globalState.update(this.config.cacheKey, cache);
  }

  clearCache(): void {
    this.extensionContext.globalState.update(this.config.filesCacheKey, {});
    this.extensionContext.globalState.update(this.config.cacheKey, {});
  }

  private getFlatFromCache(): Item[] | undefined {
    const cache: any = this.extensionContext.globalState.get(
      this.config.filesCacheKey
    );
    let cachedData = [];
    if (cache) {
      const key = "files";
      cachedData = cache[key];
    }
    return cachedData;
  }

  private updateFilesCache(data: Item[]): void {
    let cache: any = this.extensionContext.globalState.get(
      this.config.filesCacheKey
    );
    if (!cache) {
      cache = {};
    }

    cache["files"] = data;

    this.extensionContext.globalState.update(this.config.filesCacheKey, cache);
  }

  private prepareQpData(data: Item[]): QuickPickExtendedItem[] {
    const shouldDisplayFlatList = getConfiguration<boolean>(
      "goToMDN.shouldDisplayFlatList",
      false
    );
    const qpData: QuickPickExtendedItem[] = this.mapDataToQpData(data, shouldDisplayFlatList);
    !shouldDisplayFlatList && this.addBackwardNavigationItem(data, qpData);
    return qpData;
  }

  private mapDataToQpData(data: Item[], isFlat: boolean = false): QuickPickExtendedItem[] {
    return data.map(el => {
      const icon =
        el.type === ItemType.Directory ? "$(file-directory)" : "$(link)";
      const description = isFlat ? el.breadcrumbs.join(" ") : undefined;
      return {
        label: `${icon} ${el.name}`,
        url: el.url,
        parent: el.parent,
        rootParent: el.rootParent,
        type: el.type,
        breadcrumbs: el.breadcrumbs,
        description,
      };
    });
  }

  private addBackwardNavigationItem(
    data: Item[],
    qpData: QuickPickExtendedItem[]
  ): void {
    if (data.length) {
      data[0].parent &&
        qpData.unshift({
          label: `$(file-directory) ${this.config.higherLevelLabel}`,
          description: data.length ? this.prepareBreadcrumbs(data[0]) : "",
          type: ItemType.Directory,
          url: "#",
          breadcrumbs: []
        });
    }
  }

  private prepareBreadcrumbs(item: Item): string {
    const breadcrumbs = [...item.breadcrumbs].slice(0, -1);
    return breadcrumbs.join(" / ");
  }

  private async openInBrowser(url: string): Promise<void> {
    await open(url);
  }
}

export default ExtensionController;
