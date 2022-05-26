import fetch, { Response } from "node-fetch";
import { appConfig } from "./appConfig";
import { getGithubPersonalAccessToken } from "./config";
import ItemType from "./enum/itemType";
import Item from "./interface/item";
import {
  parseDirectories,
  parseElements,
  parseFlatElements,
  parseRootDirectories,
} from "./parser";

async function fetchTreeData(item: Item) {
  return await fetchFn(item.url, getContent);
}

async function fetchFn(url: string, callback: Function): Promise<any> {
  const response: Response = await getResponse(url);
  return await callback(response);
}

function getFetchConfig() {
  const token = getGithubPersonalAccessToken();

  return {
    headers: {
      Authorization: token ? `token ${token}` : "",
      "Content-type": "application/json",
    },
  };
}

async function getResponse(url: string): Promise<Response> {
  const fetchConfig = getFetchConfig();
  return await fetch(url, fetchConfig).catch((error: Error) => {
    throw new Error(error.message);
  });
}

async function fetchFlatData() {
  return await fetchFn(appConfig.allFilesUrl, getJson);
}

async function getJson(response: Response): Promise<any> {
  const statusCode = response.status;
  const statusText = response.statusText;
  if (statusCode !== 200) {
    throw new Error(statusText);
  }
  return await response.json();
}

async function getContent(response: Response) {
  let json = await getJson(response);
  return json.encoding
    ? Buffer.from(json.content, json.encoding).toString("utf-8")
    : json;
}

export async function downloadTreeData(item?: Item): Promise<Item[]> {
  item = item || {
    name: "root",
    url: appConfig.rootUrl,
    type: ItemType.Directory,
    breadcrumbs: [],
  };

  let items: Item[];
  const content = await fetchTreeData(item);

  if (item.name === "root") {
    items = parseRootDirectories(content);
  } else if (typeof content === "string") {
    items = parseElements(content, item);
  } else {
    items = parseDirectories(content, item);
  }

  return items;
}

export async function downloadFlatData(): Promise<Item[]> {
  const json = await fetchFlatData();
  return parseFlatElements(json);
}
