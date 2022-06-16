import * as vscode from "vscode";
import { getDataFromCache, updateDataInCache } from "./cache";
import { prepareQpData } from "./dataConverter";
import { downloadData } from "./dataDownloader";
import Item from "./interface/item";
import QuickPickItem from "./interface/quickPickItem";

export async function getQuickPickData(): Promise<QuickPickItem[]> {
  let data = getDataFromCache();
  const inCache = data ? data.length > 0 : false;

  if (!inCache) {
    await cacheDataWithProgress();
    data = getDataFromCache();
  }

  return data ? prepareQpData(data) : [];
}

async function downloadAllData(): Promise<Item[]> {
  const data = await downloadData();
  updateDataInCache(data);
  return data;
}

async function getData(
  progress: vscode.Progress<{
    message?: string | undefined;
    increment?: number | undefined;
  }>
): Promise<void> {
  progress &&
    progress.report({
      increment: 40,
    });

  await downloadAllData();

  progress &&
    progress.report({
      increment: 60,
    });
}

async function cacheDataWithProgress() {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Downloading and indexing data for MDN...",
      cancellable: false,
    },
    cacheDataWithProgressTask
  );
}

export async function cacheDataWithProgressTask(
  progress: vscode.Progress<{
    message?: string | undefined;
    increment?: number | undefined;
  }>
) {
  await getData(progress);
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 250);
  });
}
