import fetch, { Response } from "node-fetch";
import { appConfig } from "./appConfig";
import { getGithubPersonalAccessToken } from "./config";
import ItemType from "./enum/itemType";
import Item from "./interface/item";
import Parser from "./parser";

class DataDownloader {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async downloadTreeData(item?: Item): Promise<Item[]> {
    item = item || {
      name: "root",
      url: appConfig.rootUrl,
      type: ItemType.Directory,
      breadcrumbs: [],
    };

    let items: Item[];
    const content = await this.fetchTreeData(item);

    if (item.name === "root") {
      items = this.parser.parseRootDirectories(content);
    } else if (typeof content === "string") {
      items = this.parser.parseElements(content, item);
    } else {
      items = this.parser.parseDirectories(content, item);
    }

    return items;
  }

  async downloadFlatData(): Promise<Item[]> {
    const json = await this.fetchFlatData();
    return this.parser.parseFlatElements(json);
  }

  private async fetchTreeData(item: Item) {
    return await this.fetch(item.url, this.getContent);
  }

  private async fetch(url: string, callback: Function): Promise<any> {
    const response: Response = await this.getResponse(url);
    return await callback(response);
  }

  private getFetchConfig() {
    const token = getGithubPersonalAccessToken();

    return {
      headers: {
        Authorization: token ? `token ${token}` : "",
        "Content-type": "application/json",
      },
    };
  }

  private async getResponse(url: string): Promise<Response> {
    const fetchConfig = this.getFetchConfig();
    return await fetch(url, fetchConfig).catch((error: Error) => {
      throw new Error(error.message);
    });
  }

  private async fetchFlatData() {
    return await this.fetch(appConfig.allFilesUrl, this.getJson);
  }

  private async getJson(response: Response): Promise<any> {
    const statusCode = response.status;
    const statusText = response.statusText;
    if (statusCode !== 200) {
      throw new Error(statusText);
    }
    return await response.json();
  }

  private getContent = async (response: Response): Promise<any> => {
    let json = await this.getJson(response);
    return json.encoding
      ? Buffer.from(json.content, json.encoding).toString("utf-8")
      : json;
  };
}

export default DataDownloader;
