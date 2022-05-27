import * as vscode from "vscode";
import { appConfig } from "./appConfig";
import {
  getFlatData,
  getTreeDataByItem,
  updateFlatData,
  updateTreeDataByItem,
} from "./cache";
import { shouldDisplayFlatList } from "./config";
import { mapQpItemToItem, prepareQpData } from "./dataConverter";
import { downloadFlatData, downloadTreeData } from "./dataDownloader";
import Item from "./interface/item";
import QuickPickItem from "./interface/quickPickItem";
import { getNameFromQuickPickItem, removeDataWithEmptyUrl } from "./utils";

export let higherLevelData: QuickPickItem[][] = [];
const onWillGoLowerTreeLevelEventEmitter: vscode.EventEmitter<void> =
  new vscode.EventEmitter();
export const onWillGoLowerTreeLevel: vscode.Event<void> =
  onWillGoLowerTreeLevelEventEmitter.event;

export async function getFlatQuickPickData(): Promise<QuickPickItem[]> {
  let data = getFlatData();
  const areCached = data ? data.length > 0 : false;

  if (!areCached) {
    await cacheFlatFilesWithProgress();
    data = getFlatData();
  }

  return data ? prepareQpData(data) : [];
}

export async function getQuickPickRootData(): Promise<QuickPickItem[]> {
  return await getTreeData(true);
}

export async function getQuickPickData(
  value: QuickPickItem
): Promise<QuickPickItem[]> {
  let data: QuickPickItem[];
  const name = getNameFromQuickPickItem(value);
  if (name === appConfig.higherLevelLabel) {
    data = getHigherLevelQpData();
  } else {
    data = await getLowerLevelQpData(value);
    onWillGoLowerTreeLevelEventEmitter.fire();
  }
  return data;
}

export function rememberHigherLevelQpData(items: QuickPickItem[]): void {
  items.length && higherLevelData.push(items);
}

export function isHigherLevelDataEmpty(): boolean {
  return !higherLevelData.length;
}

function getHigherLevelQpData(): QuickPickItem[] {
  return higherLevelData.pop() as QuickPickItem[];
}

export async function getLowerLevelQpData(
  value: QuickPickItem
): Promise<QuickPickItem[]> {
  let data = await getTreeData(false, value);
  data = removeDataWithEmptyUrl(data);
  return data;
}

export async function getTreeData(
  isRootLevel: boolean,
  qpItem?: QuickPickItem
): Promise<QuickPickItem[]> {
  let data = getTreeDataByItem(qpItem);

  if (!data || !data.length) {
    let item = qpItem && mapQpItemToItem(qpItem);
    data = await downloadTreeDataFn(item);
  }
  return prepareQpData(data, isRootLevel);
}

async function downloadTreeDataFn(item?: Item): Promise<Item[]> {
  const data = await downloadTreeData(item);
  updateTreeDataByItem(data, item);
  return data;
}

async function downloadFlatFilesData(): Promise<Item[]> {
  const data = await downloadFlatData();
  updateFlatData(data);
  return data;
}

async function getFlatFilesData(
  progress: vscode.Progress<{
    message?: string | undefined;
    increment?: number | undefined;
  }>
): Promise<void> {
  progress &&
    progress.report({
      increment: 40,
    });

  await downloadFlatFilesData();

  progress &&
    progress.report({
      increment: 60,
    });
}

async function cacheFlatFilesWithProgress() {
  if (shouldDisplayFlatList()) {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Downloading and indexing data for MDN...",
        cancellable: false,
      },
      cacheFlatFilesWithProgressTask
    );
  }
}

export async function cacheFlatFilesWithProgressTask(
  progress: vscode.Progress<{
    message?: string | undefined;
    increment?: number | undefined;
  }>
) {
  await getFlatFilesData(progress);
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 250);
  });
}
