import fetch, { Response } from "node-fetch";
import Item from "./interfaces/item";
import ItemType from "./enums/itemType";
import Parser from './parser';
import { getConfiguration } from "./utils";
import { config } from './config';

class DataService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async downloadTreeData(item?: Item): Promise<Item[]> {
    if (!item) {
      item = {
        name: "root",
        url: config.rootUrl,
        type: ItemType.Directory,
        breadcrumbs: []
      };
    }

    let items: Item[];
    const content = await this.fetch(item.url, this.getContent);

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
    const json = await this.fetch(config.allFilesUrl, this.getJson);
    const items: Item[] = this.parser.parseFlatElements(json);
    return items;
  }

  private async fetch(url: string, callback: Function): Promise<any> {
    const token = getConfiguration<string>(
      "goToMDN.githubPersonalAccessToken",
      ""
    );
    const fetchConfig = {
      headers: {
        Authorization: token ? `token ${token}` : "",
        "Content-type": "application/json"
      }
    };
    const response: Response = await fetch(url, fetchConfig).catch(
      (error: Error) => {
        throw new Error(error.message);
      }
    );
    return await callback(response);
  }

  private async getJson(response: Response): Promise<any> {
    const statusCode = response.status;
    const json = await response.json();
    if (statusCode === 200) {
      return json;
    }
    throw new Error(json.message);
  }

  private getContent = async (response: Response): Promise<any> => {
    let json = await this.getJson(response);
    return json.encoding
      ? Buffer.from(json.content, json.encoding).toString("utf-8")
      : json;
  };
}

export default DataService;
