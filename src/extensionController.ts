import * as vscode from "vscode";
const open = require("open");
import Config from "./interfaces/config";
import DataService from "./dataService";
import QuickPick from "./quickPick";
import Item from "./interfaces/item";
import ItemType from "./enums/itemType";
import QuickPickExtendedItem from "./interfaces/quickPickExtendedItem";

class ExtensionController {
  private config: Config;
  private dataService: DataService;
  private higherLevelData: Array<Array<QuickPickExtendedItem>>;
  private quickPick: QuickPick;

  constructor(private extensionContext: vscode.ExtensionContext) {
    this.config = {
      regex: /https:\/\/github\.com\/mdn\/browser-compat-data\/tree\/master\/[a-zA-Z]+/gm,
      searchUrl: "https://developer.mozilla.org/en-US/search",
      rootUrl:
        "https://api.github.com/repos/mdn/browser-compat-data/contents/README.md?ref=master",
      urlNormalizer: {
        from: "https://github.com/",
        to: "https://api.github.com/",
        queryString: "?ref=master"
      },
      accessProperty: "__compat",
      higherLevelLabel: '..',
      cacheKey: "cache"
    };
    this.dataService = new DataService(this.config);
    this.quickPick = new QuickPick(this.onQuickPickSubmit);
    this.higherLevelData = [];
  }

  onQuickPickSubmit = async (value: QuickPickExtendedItem | string) => {
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

  async showQuickPick() {
    await this.loadQuickPickData();
    this.quickPick.show();
  }

  hideQuickPick() {
    this.quickPick.hide();
  }

  private isValueStringType(value: QuickPickExtendedItem | string) {
    return typeof value === "string";
  }

  private isValueFileType(value: QuickPickExtendedItem) {
    return value.type === ItemType.File;
  }

  private isHigherLevelDataEmpty() {
    return !this.higherLevelData.length;
  }

  private async loadQuickPickData(value?: QuickPickExtendedItem) {
    this.quickPick.showLoading(true);
    let data: Array<QuickPickExtendedItem>;
    if (value) {
      data = await this.getQuickPickData(value);
    } else {
      data = await this.getQuickPickRootData();
    }
    this.prepareQuickPickPlaceholder();

    this.quickPick.clearText();
    this.quickPick.loadItems(data);
    this.quickPick.showLoading(false);
  }

  private prepareQuickPickPlaceholder() {
    this.higherLevelData.length
      ? this.clearQuickPickPlaceholder()
      : this.setQuickPickPlaceholder();
  }

  private async getQuickPickRootData() {
    return await this.getData();
  }

  private async getQuickPickData(value: QuickPickExtendedItem) {
    let data: Array<QuickPickExtendedItem>;
    const name = this.getNameFromQuickPickItem(value);
    if (name === this.config.higherLevelLabel) {
      data = this.getHigherLevelQpData();
    } else {
      data = await this.getLowerLevelQpData(value);
      this.rememberHigherLevelQpData();
    }
    return data;
  }

  private rememberHigherLevelQpData() {
    const qpData = this.quickPick.getItems();
    qpData.length && this.higherLevelData.push(qpData);
  }

  private getHigherLevelQpData() {
    return this.higherLevelData.pop() as Array<QuickPickExtendedItem>;
  }

  private async getLowerLevelQpData(value: QuickPickExtendedItem) {
    let data: Array<QuickPickExtendedItem>;
    data = await this.getData(value);
    data = this.removeDataWithEmptyUrl(data);
    return data;
  }

  private setQuickPickPlaceholder() {
    this.quickPick.setPlaceholder(
      "choose category from the list or type anything to search"
    );
  }

  private clearQuickPickPlaceholder() {
    this.quickPick.setPlaceholder(undefined);
  }

  private getSearchUrl(value: string) {
    const queryString = value.split(" ").join("+");
    const url = `${this.config.searchUrl}?q=${queryString}`;
    return url;
  }

  private async getData(qpItem?: QuickPickExtendedItem) {
    let data = this.getFromCache(qpItem);

    if (!data || !data.length) {
      let item: Item | undefined = qpItem && this.mapQpItemToItem(qpItem);
      data = await this.downloadData(item);
    }
    const qpData = this.prepareQpData(data);
    return qpData;
  }

  private mapQpItemToItem(qpItem: QuickPickExtendedItem) {
    return {
      name: this.getNameFromQuickPickItem(qpItem),
      url: qpItem.url,
      type: qpItem.type,
      parent: qpItem.parent,
      rootParent: qpItem.rootParent,
      breadcrumbs: qpItem.breadcrumbs
    };
  }

  private async downloadData(item?: Item) {
    const data = await this.dataService.downloadData(item);
    this.updateCache(data, item);
    return data;
  }

  private removeDataWithEmptyUrl(data: QuickPickExtendedItem[]) {
    return data.filter(element => element.url);
  }

  private getNameFromQuickPickItem(item: QuickPickExtendedItem) {
    return item.label
      .split(" ")
      .slice(1)
      .join(" ");
  }

  private getFromCache(item?: QuickPickExtendedItem) {
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

  private updateCache(data: Array<Item>, item?: Item) {
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

  clearCache() {
    this.extensionContext.globalState.update(this.config.cacheKey, {});
  }

  private prepareQpData(data: Array<Item>) {
    const qpData: Array<QuickPickExtendedItem> = this.mapDataToQpData(data);
    this.addBackwardNavigationItem(data, qpData);
    return qpData;
  }

  private mapDataToQpData(data: Array<Item>) {
    return data.map(el => {
      const icon =
        el.type === ItemType.Directory ? "$(file-directory)" : "$(link)";
      return {
        label: `${icon} ${el.name}`,
        url: el.url,
        parent: el.parent,
        rootParent: el.rootParent,
        type: el.type,
        breadcrumbs: el.breadcrumbs
      };
    });
  }

  private addBackwardNavigationItem(
    data: Array<Item>,
    qpData: Array<QuickPickExtendedItem>
  ) {
    if (data.length) {
      // tslint:disable-next-line: no-unused-expression
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

  private prepareBreadcrumbs(item: Item) {
    const breadcrumbs = [...item.breadcrumbs].slice(0, -1);
    return breadcrumbs.join(" / ");
  }

  private async openInBrowser(url: string) {
    await open(url);
  }
}

export default ExtensionController;
