import fetch, { Response } from "node-fetch";
import { appConfig } from "./appConfig";
import Item from "./interface/item";
import { parseData } from "./parser";

async function fetchFn(url: string) {
  return await getResponse(url);
}

async function getResponse(url: string): Promise<Response> {
  return await fetch(url).catch((error: Error) => {
    throw new Error(error.message);
  });
}

async function fetchData() {
  const response = await fetchFn(appConfig.inputDataUrl);
  return await getJson(response);
}

async function getJson(response: Response): Promise<any> {
  const statusCode = response.status;
  const statusText = response.statusText;
  if (statusCode !== 200) {
    throw new Error(statusText);
  }
  return await response.json();
}

export async function downloadData(): Promise<Item[]> {
  const json = await fetchData();
  return parseData(json);
}
