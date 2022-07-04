import * as vscode from "vscode";
import { getDataFromCache, updateDataInCache } from "./cache";
import { prepareOutputData } from "./dataConverter";
import { downloadData } from "./dataDownloader";

export async function getQuickPickData() {
  let data = getDataFromCache();
  const inCache = data ? data.count > 0 : false;

  if (!inCache) {
    await cacheDataWithProgress();
    data = getDataFromCache();
  }

  return data || [];
}

async function getData(
  progress: vscode.Progress<{
    message?: string | undefined;
    increment?: number | undefined;
  }>
): Promise<void> {
  reportProgress(progress, 25);
  const inputData = await downloadData();

  reportProgress(progress, 25);
  const outputData = prepareOutputData(inputData);

  reportProgress(progress, 25);
  updateDataInCache(outputData);

  reportProgress(progress, 25);
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

function reportProgress(
  progress: vscode.Progress<{
    message?: string | undefined;
    increment?: number | undefined;
  }>,
  increment: number
) {
  progress &&
    progress.report({
      increment,
    });
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
