import Item from "./interface/item";
import ItemType from "./enum/itemType";
import { appConfig } from "./appConfig";

class Parser {
  parseFlatElements(json: any): Item[] {
    return json.items
      ? json.items.map((item: any) => this.parseFlatElement(item))
      : [];
  }

  parseRootDirectories(content: any): Item[] {
    const results = content.match(appConfig.regex) || [];
    return results.map((item: any) => this.parseRootDirectory(item));
  }

  parseElements(content: any, item: Item): Item[] {
    const data: Item[] = [];
    let itemElements = JSON.parse(content);

    if (!item.parent) {
      return data;
    }

    itemElements = this.getItemElementsAtFirstItemLevel(itemElements);
    this.addReferenceElement(data, itemElements, item);
    this.addElements(data, itemElements, item);

    return data;
  }

  parseDirectories(content: any, item: Item): Item[] {
    return content.map((el: any) => this.parseDirectory(item, el.url));
  }

  private parseFlatElement(item: any): Item {
    return this.createItem(
      item.name,
      item.url,
      ItemType.File,
      [...item.breadcrumbs],
      item.parent || undefined
    );
  }

  private parseRootDirectory(item: any): Item {
    const url = this.normalizeUrl(item);
    const name = this.getNameFromUrl(url);

    return this.createItem(name, url, ItemType.Directory, [name]);
  }

  private parseDirectory(item: any, url: string): Item {
    let name = this.getNameFromUrl(url);
    name = this.normalizeItemName(name);

    return this.createItem(
      name,
      url,
      ItemType.Directory,
      [...item.breadcrumbs, name],
      item,
      item.parent || item
    );
  }

  private normalizeUrl(url: string): string {
    const splitPathName = this.getPathNameSplit(url);
    return `${appConfig.urlNormalizer.to}repos/${splitPathName[0]}/${splitPathName[1]}/contents/${splitPathName[4]}${appConfig.urlNormalizer.queryString}`;
  }

  private getNameFromUrl(url: string): string {
    const splitPathName = this.getPathNameSplit(url);
    return splitPathName[splitPathName.length - 1];
  }

  private getPathNameSplit(url: string): string[] {
    return url
      .replace(appConfig.urlNormalizer.from, "")
      .replace(appConfig.urlNormalizer.to, "")
      .replace(appConfig.urlNormalizer.queryString, "")
      .split("/");
  }

  private getItemElementsAtFirstItemLevel(itemElements: any): any {
    while (this.ifItemElementsHaveNotAccessProperty(itemElements)) {
      const propertyName = Object.keys(itemElements)[0] || "";
      itemElements = itemElements[propertyName];
    }
    return itemElements;
  }

  private ifItemElementsHaveNotAccessProperty(itemElements: any): boolean {
    return (
      itemElements &&
      !Object.hasOwnProperty.call(itemElements, appConfig.accessProperty)
    );
  }

  private addReferenceElement(
    data: Item[],
    itemElements: any,
    item: Item
  ): void {
    data.push(
      this.createItem(
        `${item.name} - reference`,
        this.getUrlForReferenceElement(itemElements),
        ItemType.File,
        [...item.breadcrumbs, item.name],
        item
      )
    );

    itemElements && delete itemElements[appConfig.accessProperty];
  }

  private getUrlForReferenceElement(itemElements: any): string {
    return (
      (itemElements &&
        itemElements[appConfig.accessProperty] &&
        itemElements[appConfig.accessProperty].mdn_url) ||
      ""
    );
  }

  private addElements(data: Item[], itemElements: any, item: Item): void {
    for (let prop in itemElements) {
      let element = itemElements[prop];

      !element.hasOwnProperty(appConfig.accessProperty)
        ? this.addLowestLevelElements(data, element, item)
        : this.addLowestLevelElement(data, element, item, prop);
    }
  }

  private addLowestLevelElements(data: Item[], element: any, item: Item) {
    for (let innerProp in element) {
      let innerElement = element[innerProp];
      data.push(this.addElement(innerElement, innerProp, item));
    }
  }

  private addLowestLevelElement(
    data: Item[],
    element: any,
    item: Item,
    prop: string
  ) {
    element = element[appConfig.accessProperty];
    data.push(this.addElement(element, prop, item));
  }

  private addElement(element: any, prop: string, item: Item): Item {
    const name = this.normalizeItemName(prop);

    return this.createItem(
      name,
      element.mdn_url || "",
      ItemType.File,
      [...item.breadcrumbs, name],
      item
    );
  }

  private normalizeItemName(name: string): string {
    return name
      .replace(".json", "")
      .split(/(?=[A-Z][a-z])/)
      .join(" ");
  }

  private createItem(
    name: string,
    url: string,
    type: ItemType,
    breadcrumbs: string[],
    parent?: Item,
    rootParent?: Item
  ): Item {
    return {
      name,
      url,
      parent,
      rootParent,
      type,
      breadcrumbs,
    };
  }
}

export default Parser;
