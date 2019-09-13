import * as vscode from "vscode";
import QuickPickExtendedItem from "./interfaces/QuickPickExtendedItem";

class QuickPick {
  private quickPick: vscode.QuickPick<QuickPickExtendedItem>;

  constructor(callback: Function) {
    this.quickPick = vscode.window.createQuickPick<QuickPickExtendedItem>();
    this.quickPick.onDidHide(() => this.quickPick.dispose());
    this.quickPick.onDidAccept(() => {
      const selected = this.quickPick.selectedItems[0];
      this.submit(selected, callback);
    });
  }

  show(): void {
    this.quickPick.show();
  }

  hide(): void {
    this.quickPick.hide();
  }

  loadItems(items: Array<QuickPickExtendedItem>): void {
    this.quickPick.items = items;
  }

  getItems(): Array<QuickPickExtendedItem> {
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
}

export default QuickPick;
