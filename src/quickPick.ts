import * as vscode from "vscode";
// import Cache from "./cache";
import Config from "./config";
import DataService from "./dataService";
import QuickPickItem from "./interface/QuickPickItem";
import {
  getSearchUrl,
  isValueFileType,
  isValueStringType,
  printErrorMessage,
} from "./utils";
const open = require("open");
const debounce = require("debounce");

class QuickPick {
  private quickPick: vscode.QuickPick<QuickPickItem>;
  private items: QuickPickItem[] = [];

  private config: Config;
  private dataService: DataService;

  private open: any = open;

  constructor() {
    this.config = new Config();
    this.dataService = new DataService(this.config);
    this.dataService.onWillGoLowerTreeLevel(this.onWillGoLowerTreeLevel);

    this.quickPick = vscode.window.createQuickPick<QuickPickItem>();
    this.quickPick.matchOnDescription = true;
  }

  registerEventListeners(): void {
    this.quickPick.onDidHide(this.onDidHide);
    this.quickPick.onDidAccept(this.onDidAccept);

    if (this.config.shouldDisplayFlatList()) {
      this.quickPick.onDidChangeValue(this.onDidChangeValueClearing);
      this.quickPick.onDidChangeValue(debounce(this.onDidChangeValue, 350));
    } else {
      this.quickPick.onDidChangeValue(this.onDidChangeValue);
    }
  }

  show(): void {
    this.quickPick.show();
  }

  hide(): void {
    this.quickPick.hide();
  }

  async loadQuickPickData(value?: QuickPickItem): Promise<void> {
    this.showLoading(true);
    let data: QuickPickItem[];

    if (this.config.shouldDisplayFlatList()) {
      data = await this.dataService.getFlatQuickPickData();
    } else if (value) {
      data = await this.dataService.getQuickPickData(value);
    } else {
      data = await this.dataService.getQuickPickRootData();
    }
    this.preparePlaceholder();

    this.clearText();
    this.loadItems(data);
    this.showLoading(false);
  }

  private async submit(selected: QuickPickItem | undefined): Promise<void> {
    const value = this.normalizeSubmittedValue(selected);

    try {
      if (isValueStringType(value)) {
        if (!this.dataService.isHigherLevelDataEmpty()) {
          return;
        }
        await this.processIfValueIsStringType(value as string);
      } else {
        await this.processIfValueIsQuickPickItemType(value as QuickPickItem);
      }
    } catch (error) {
      printErrorMessage(error as Error);
    }
  }

  private loadItems(items: QuickPickItem[]): void {
    this.setQpItems(items);
    this.setItems(items);
  }

  private setItems(items: QuickPickItem[]): void {
    this.items = items;
  }

  private setQpItems(items: QuickPickItem[]): void {
    this.quickPick.items = items;
  }

  private getItems(): QuickPickItem[] {
    return [...this.quickPick.items];
  }

  private showLoading(flag: boolean): void {
    this.quickPick.busy = flag;
  }

  private setPlaceholder(text: string | undefined): void {
    this.quickPick.placeholder = text;
  }

  private preparePlaceholder(): void {
    this.dataService.isHigherLevelDataEmpty()
      ? this.setPlaceholder(
          "choose item from the list or type anything to search"
        )
      : this.setPlaceholder("");
  }

  private clearText(): void {
    this.quickPick.value = "";
  }

  private filter(value: string): QuickPickItem[] {
    return this.items.filter(
      (item) =>
        item.label.toLowerCase().includes(value.toLowerCase()) ||
        item.description!.toLowerCase().includes(value.toLowerCase())
    );
  }

  private async processIfValueIsStringType(value: string) {
    const url = getSearchUrl(value);
    url && (await this.openInBrowser(url));
  }

  private async processIfValueIsQuickPickItemType(value: QuickPickItem) {
    if (isValueFileType(value)) {
      let url = value.url;
      url && (await this.openInBrowser(url));
    } else {
      this.loadQuickPickData(value);
    }
  }

  private normalizeSubmittedValue(value: QuickPickItem | undefined) {
    return value || this.quickPick.value;
  }

  private async openInBrowser(url: string): Promise<void> {
    await this.open(url);
  }

  private getSelectedItem(): QuickPickItem {
    return this.quickPick.selectedItems[0];
  }

  private onDidAccept = async () => {
    const selected = this.getSelectedItem();
    await this.submit(selected);
  };

  private onDidHide = () => {
    this.clearText();
  };

  private onDidChangeValueClearing = () => {
    this.setQpItems([]);
  };

  private onDidChangeValue = (value: string) => {
    this.showLoading(true);
    const items = this.filter(value);
    this.setQpItems(items);
    this.showLoading(false);
  };

  private onWillGoLowerTreeLevel = () => {
    const items = this.getItems();
    this.dataService.rememberHigherLevelQpData(items);
  };
}

export default QuickPick;
