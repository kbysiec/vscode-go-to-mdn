import { QuickPickItem as QuickPickItemVscode } from "vscode";

export interface Item {
  name: string;
  url: string;
  breadcrumbs: string[];
}

export interface QuickPickItem extends QuickPickItemVscode {
  url: string;
  breadcrumbs: string[];
}

export interface InputData {
  items: Item[];
  count: number;
}

export interface OutputData {
  items: QuickPickItem[];
  count: number;
}

export interface Json {
  [key: string]: any;
}
