import * as vscode from "vscode";
const debounce = require("debounce");
import QuickPickItem from "./interfaces/QuickPickItem";

class QuickPick {
  private quickPick: vscode.QuickPick<QuickPickItem>;
  private items: QuickPickItem[] = [];

  constructor(
    onQuickPickSubmitCallback: Function,
    shouldDebounce: boolean = false
  ) {
    this.quickPick = vscode.window.createQuickPick<QuickPickItem>();
    this.quickPick.matchOnDescription = true;
    this.quickPick.onDidHide(this.onDidHide);
    this.quickPick.onDidAccept(
      this.onDidAccept.bind(this, onQuickPickSubmitCallback)
    );

    if (shouldDebounce) {
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

  loadItems(items: QuickPickItem[]): void {
    this.quickPick.items = items;
    this.items = items;
  }

  getItems(): QuickPickItem[] {
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

  private submit(
    selected: QuickPickItem | undefined,
    callback: Function
  ): void {
    let value;
    if (selected === undefined) {
      value = this.quickPick.value;
    } else {
      value = selected;
    }

    callback(value);
  }

  private onDidAccept = (onQuickPickSubmitCallback: Function) => {
    const selected = this.quickPick.selectedItems[0];
    this.submit(selected, onQuickPickSubmitCallback);
  };

  private onDidHide = () => {
    this.quickPick.dispose();
  };

  private onDidChangeValueClearing = () => {
    this.quickPick.items = [];
  };

  private onDidChangeValue = (value: string) => {
    this.quickPick.busy = true;
    const items = this.filter(value);
    this.quickPick.items = items;
    this.quickPick.busy = false;
  };

  private filter(value: string): QuickPickItem[] {
    return this.items.filter(
      (item) =>
        item.label.toLowerCase().includes(value.toLowerCase()) ||
        item.description!.toLowerCase().includes(value.toLowerCase())
    );
  }
}

export default QuickPick;
