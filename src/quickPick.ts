import * as vscode from "vscode";
const debounce = require("debounce");
import QuickPickExtendedItem from "./interfaces/QuickPickExtendedItem";

class QuickPick {
  private quickPick: vscode.QuickPick<QuickPickExtendedItem>;
  private items: QuickPickExtendedItem[] = [];

  constructor(onQuickPickSubmitCallback: Function, shouldDebounce: boolean = false) {
    this.quickPick = vscode.window.createQuickPick<QuickPickExtendedItem>();
    this.quickPick.matchOnDescription = true;
    this.quickPick.onDidHide(() => this.quickPick.dispose());
    this.quickPick.onDidAccept(() => {
      const selected = this.quickPick.selectedItems[0];
      this.submit(selected, onQuickPickSubmitCallback);
    });

    if (shouldDebounce) {
      this.quickPick.onDidChangeValue((value: string) => {
        this.quickPick.items = [];
      });
      this.quickPick.onDidChangeValue(debounce(this.onDidChangeValue, 350));
    }
    else {
      this.quickPick.onDidChangeValue(this.onDidChangeValue);
    }

  }

  show(): void {
    this.quickPick.show();
  }

  hide(): void {
    this.quickPick.hide();
  }

  loadItems(items: QuickPickExtendedItem[]): void {
    this.quickPick.items = items;
    this.items = items;
  }

  getItems(): QuickPickExtendedItem[] {
    return [...this.quickPick.items];
  }

  showLoading(flag: boolean): void {
    this.quickPick.busy = flag;
  }

  setPlaceholder(text: string | undefined): void {
    this.quickPick.placeholder = text;
  }

  clearText(): void {
    this.quickPick.value = "";
  }

  submit(selected: QuickPickExtendedItem, callback: Function): void {
    let value;
    if (selected === undefined) {
      value = this.quickPick.value;
    } else {
      value = selected;
    }
    if (callback) {
      callback(value);
    }
  }

  private onDidChangeValue = (value: string) => {
    this.quickPick.busy = true;
    const items = this.filter(value);
    this.quickPick.items = items;
    this.quickPick.busy = false;
  }

  private filter(value: string): QuickPickExtendedItem[] {
    return this.items.filter(item => item.label.toLowerCase().includes(value.toLowerCase()) ||
      item.description!.toLowerCase().includes(value.toLowerCase()));
  }
}

export default QuickPick;
