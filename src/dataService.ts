import fetch, { Response } from "node-fetch";
import Config from "./interfaces/config";
import Item from "./interfaces/item";
import ItemType from "./enums/itemType";
import { getConfiguration } from "./common";

class DataService {
  constructor(private config: Config) { }

  async downloadData(item?: Item): Promise<Item[]> {
    if (!item) {
      item = {
        name: "root",
        url: this.config.rootUrl,
        type: ItemType.Directory,
        breadcrumbs: []
      };
    }

    let items: Item[];
    const content = await this.fetch(item.url, this.getContent);

    if (item.name === "root") {
      items = this.parseRootDirectories(content);
    } else if (typeof content === "string") {
      items = this.parseElements(content, item);
    } else {
      items = this.parseDirectories(content, item);
    }

    return items;
  }

  async downloadFlatData(): Promise<Item[]> {
    const json = await this.fetch(this.config.allFilesUrl, this.getJson);
    const items: Item[] = this.parseFlatElements(json);
    return items;
  }

  private parseFlatElements(data: any): Item[] {
    let items: Item[] = [];

    if (data.items) {
      items = data.items.map((el: any) => ({
        name: el.name,
        url: el.url,
        parent: el.parent,
        type: ItemType.File,
        breadcrumbs: [...el.breadcrumbs]
      }));
    }

    return items;
  }

  private parseRootDirectories(content: any): Item[] {
    const results = content.match(this.config.regex) || [];
    const data: Item[] = results.map((el: any) => {
      const url = this.normalizeUrl(el);
      const type = ItemType.Directory;
      const name = this.getNameFromUrl(url);
      return {
        name,
        url,
        type,
        breadcrumbs: [name]
      };
    });

    return data;
  }

  private parseDirectories(content: any, item: Item): Item[] {
    const data: Item[] = content.map((el: any) => {
      const url = el.url;
      const type = this.getItemType(el);
      let name = this.getNameFromUrl(url);
      name = this.normalizeItemName(name);
      return {
        name,
        url,
        type,
        parent: item,
        rootParent: item.parent || item,
        breadcrumbs: [...item.breadcrumbs, name]
      };
    });

    return data;
  }

  private parseElements(content: any, item: Item): Item[] {
    const data: Item[] = [];
    let itemElements = JSON.parse(content);

    if (!item.parent || !item.rootParent) {
      return data;
    }

    itemElements = this.getItemElementsAtFirstItemLevel(itemElements);
    this.addReferenceElement(data, itemElements, item);
    this.addElements(data, itemElements, item);

    return data;
  }

  private getItemElementsAtFirstItemLevel(itemElements: any): any {
    while (
      !Object.hasOwnProperty.call(itemElements, this.config.accessProperty)
    ) {
      const propertyName = Object.keys(itemElements)[0] || "";
      itemElements = itemElements[propertyName];
    }
    return itemElements;
  }

  private addReferenceElement(
    data: Item[],
    itemElements: any,
    item: Item
  ): void {
    data.push({
      name: `${item.name} - reference`,
      url: itemElements[this.config.accessProperty].mdn_url,
      parent: item,
      type: ItemType.File,
      breadcrumbs: [...item.breadcrumbs, item.name]
    });

    delete itemElements[this.config.accessProperty];
  }

  private addElements(data: Item[], itemElements: any, item: Item): void {
    for (let prop in itemElements) {
      let element = itemElements[prop];

      if (!element.hasOwnProperty(this.config.accessProperty)) {
        for (let innerProp in element) {
          let innerElement = element[innerProp];

          const name = this.normalizeItemName(innerProp);
          data.push({
            name,
            url: innerElement.mdn_url || "",
            parent: item,
            type: ItemType.File,
            breadcrumbs: [...item.breadcrumbs, name]
          });
        }
      } else {
        element = element[this.config.accessProperty];

        const name = this.normalizeItemName(prop);
        data.push({
          name,
          url: element.mdn_url || "",
          parent: item,
          type: ItemType.File,
          breadcrumbs: [...item.breadcrumbs, name]
        });
      }
    }
  }

  private getItemType(item: any): ItemType {
    if (
      item.type === ItemType.Directory ||
      (item.type === ItemType.File && !item.content)
    ) {
      return ItemType.Directory;
    }
    return ItemType.File;
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

  private normalizeItemName(name: string): string {
    return name
      .replace(".json", "")
      .split(/(?=[A-Z][a-z])/)
      .join(" ");
  }

  private normalizeUrl(url: string): string {
    const splitPathName = this.getPathNameSplit(url);
    return `${this.config.urlNormalizer.to}repos/${splitPathName[0]}/${splitPathName[1]}/contents/${splitPathName[4]}${this.config.urlNormalizer.queryString}`;
  }

  private getPathNameSplit(url: string): string[] {
    return url
      .replace(this.config.urlNormalizer.from, "")
      .replace(this.config.urlNormalizer.to, "")
      .replace(this.config.urlNormalizer.queryString, "")
      .split("/");
  }

  private getNameFromUrl(url: string): string {
    const splitPathName = this.getPathNameSplit(url);
    return splitPathName[splitPathName.length - 1];
  }
}

export default DataService;
