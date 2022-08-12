import * as vscode from "vscode";
import { getQuickPickData } from "./dataService";
import { OutputData, QuickPickItem } from "./types";
import { getSearchUrl, isValueStringType, printErrorMessage } from "./utils";
const open = require("open");
const debounce = require("debounce");

function registerEventListeners(): void {
  const control = quickPick.getControl();
  control.onDidHide(quickPick.handleDidHide);
  control.onDidAccept(quickPick.handleDidAccept);

  control.onDidChangeValue(quickPick.handleDidChangeValueClearing);
  control.onDidChangeValue(debounce(quickPick.handleDidChangeValue, 350));
}

function showQuickPick(): void {
  const control = quickPick.getControl();
  control.show();
}

const loadQuickPickData = async (value?: QuickPickItem) => {
  showLoading(true);
  let data: OutputData;

  data = await getQuickPickData();
  preparePlaceholder();

  quickPick.clearText();
  loadItems(data.items);
  showLoading(false);
};

const submit = async (selected: QuickPickItem | undefined) => {
  const value = normalizeSubmittedValue(selected);

  try {
    if (isValueStringType(value)) {
      await quickPick.processIfValueIsStringType(value as string);
    } else {
      await quickPick.processIfValueIsQuickPickItemType(value as QuickPickItem);
    }
  } catch (error) {
    printErrorMessage(error as Error);
  }
};

function loadItems(items: QuickPickItem[]): void {
  setQpItems(items);
  setItems(items);
}

function setQpItems(items: QuickPickItem[]): void {
  const control = quickPick.getControl();
  control.items = items;
}

function showLoading(flag: boolean): void {
  const control = quickPick.getControl();
  control.busy = flag;
}

function setPlaceholder(text: string | undefined): void {
  const control = quickPick.getControl();
  control.placeholder = text;
}

function preparePlaceholder(): void {
  setPlaceholder("choose item from the list or type anything to search");
}

const clearText = () => {
  const control = quickPick.getControl();
  control.value = "";
};

function filter(value: string): QuickPickItem[] {
  return quickPick
    .getItems()
    .filter(
      (item) =>
        item.label.toLowerCase().includes(value.toLowerCase()) ||
        item.description!.toLowerCase().includes(value.toLowerCase())
    );
}

async function processIfValueIsStringType(value: string) {
  const url = getSearchUrl(value);
  url && (await quickPick.openInBrowser(url));
}

async function processIfValueIsQuickPickItemType(value: QuickPickItem) {
  let url = value.url;
  url && (await quickPick.openInBrowser(url));
  quickPick.loadQuickPickData(value);
}

function normalizeSubmittedValue(value: QuickPickItem | undefined) {
  const control = quickPick.getControl();
  return value || control.value;
}

async function openInBrowser(url: string): Promise<void> {
  await open(url);
}

function getSelectedItem(): QuickPickItem {
  const control = quickPick.getControl();
  return control.selectedItems[0];
}

const handleDidAccept = async () => {
  const selected = getSelectedItem();
  await quickPick.submit(selected);
};

const handleDidHide = () => {
  quickPick.clearText();
};

const handleDidChangeValueClearing = () => {
  setQpItems([]);
};

const handleDidChangeValue = (value: string) => {
  showLoading(true);
  const items = filter(value);
  setQpItems(items);
  showLoading(false);
};

function init() {
  const control = vscode.window.createQuickPick<QuickPickItem>();
  setControl(control);
  control.matchOnDescription = true;
  quickPick.registerEventListeners();
}

let quickPickControl: vscode.QuickPick<QuickPickItem>;
let items: QuickPickItem[];

function getControl() {
  return quickPickControl;
}

function setControl(newControl: vscode.QuickPick<QuickPickItem>) {
  quickPickControl = newControl;
}

function getItems() {
  return items;
}

function setItems(newItems: QuickPickItem[]): void {
  items = newItems;
}

export const quickPick = {
  getControl,
  getItems,
  setItems,
  init,
  registerEventListeners,
  showQuickPick,
  loadQuickPickData,
  submit,
  clearText,
  processIfValueIsStringType,
  processIfValueIsQuickPickItemType,
  openInBrowser,
  handleDidAccept,
  handleDidHide,
  handleDidChangeValueClearing,
  handleDidChangeValue,
};
