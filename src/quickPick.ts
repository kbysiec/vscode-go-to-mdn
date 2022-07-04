import * as vscode from "vscode";
import { getQuickPickData } from "./dataService";
import { OutputData } from "./interface/outputData";
import QuickPickItem from "./interface/QuickPickItem";
import { getSearchUrl, isValueStringType, printErrorMessage } from "./utils";
const open = require("open");
const debounce = require("debounce");

function registerEventListeners(): void {
  quickPick.quickPickControl.onDidHide(quickPick.handleDidHide);
  quickPick.quickPickControl.onDidAccept(quickPick.handleDidAccept);

  quickPick.quickPickControl.onDidChangeValue(
    quickPick.handleDidChangeValueClearing
  );
  quickPick.quickPickControl.onDidChangeValue(
    debounce(quickPick.handleDidChangeValue, 350)
  );
}

function showQuickPick(): void {
  quickPick.quickPickControl.show();
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

function setItems(newItems: QuickPickItem[]): void {
  quickPick.items = newItems;
}

function setQpItems(items: QuickPickItem[]): void {
  quickPick.quickPickControl.items = items;
}

function showLoading(flag: boolean): void {
  quickPick.quickPickControl.busy = flag;
}

function setPlaceholder(text: string | undefined): void {
  quickPick.quickPickControl.placeholder = text;
}

function preparePlaceholder(): void {
  setPlaceholder("choose item from the list or type anything to search");
}

const clearText = () => {
  quickPick.quickPickControl.value = "";
};

function filter(value: string): QuickPickItem[] {
  return quickPick.items.filter(
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
  // if (isValueFileType(value)) {
  let url = value.url;
  url && (await quickPick.openInBrowser(url));
  // } else {
  quickPick.loadQuickPickData(value);
  // }
}

function normalizeSubmittedValue(value: QuickPickItem | undefined) {
  return value || quickPick.quickPickControl.value;
}

async function openInBrowser(url: string): Promise<void> {
  await open(url);
}

function getSelectedItem(): QuickPickItem {
  return quickPick.quickPickControl.selectedItems[0];
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

type quickPickModule = {
  items: QuickPickItem[];
  quickPickControl: vscode.QuickPick<QuickPickItem>;
  registerEventListeners: () => void;
  showQuickPick: () => void;
  loadQuickPickData: (value?: QuickPickItem | undefined) => Promise<void>;
  submit: (selected: QuickPickItem | undefined) => Promise<void>;
  clearText: () => void;
  processIfValueIsStringType: (value: string) => Promise<void>;
  processIfValueIsQuickPickItemType: (value: QuickPickItem) => Promise<void>;
  openInBrowser: (url: string) => Promise<void>;
  handleDidAccept: () => Promise<void>;
  handleDidHide: () => void;
  handleDidChangeValueClearing: () => void;
  handleDidChangeValue: (value: string) => void;
};

const quickPick: quickPickModule = {
  items: [],
  quickPickControl: vscode.window.createQuickPick<QuickPickItem>(),
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

export function createQuickPick() {
  quickPick.quickPickControl.matchOnDescription = true;
  quickPick.registerEventListeners();

  return quickPick;
}
