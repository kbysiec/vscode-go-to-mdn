import Item from "./interfaces/item";
import ItemType from "./enums/itemType";
import { config } from './config';

class Parser {
  parseFlatElements(data: any): Item[] {
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

  parseRootDirectories(content: any): Item[] {
    const results = content.match(config.regex) || [];
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
    const data: Item[] = content.map((el: any) => {
      const url = el.url;
      let name = this.getNameFromUrl(url);
      name = this.normalizeItemName(name);
      return {
        name,
        url,
        type: ItemType.Directory,
        parent: item,
        rootParent: item.parent || item,
        breadcrumbs: [...item.breadcrumbs, name]
      };
    });

    return data;
  }

  private normalizeUrl(url: string): string {
    const splitPathName = this.getPathNameSplit(url);
    return `${config.urlNormalizer.to}repos/${splitPathName[0]}/${splitPathName[1]}/contents/${splitPathName[4]}${config.urlNormalizer.queryString}`;
  }

  private getNameFromUrl(url: string): string {
    const splitPathName = this.getPathNameSplit(url);
    return splitPathName[splitPathName.length - 1];
  }

  private getPathNameSplit(url: string): string[] {
    return url
      .replace(config.urlNormalizer.from, "")
      .replace(config.urlNormalizer.to, "")
      .replace(config.urlNormalizer.queryString, "")
      .split("/");
  }

  private getItemElementsAtFirstItemLevel(itemElements: any): any {
    while (
      itemElements && !Object.hasOwnProperty.call(itemElements, config.accessProperty)
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
      url: (itemElements && itemElements[config.accessProperty]) && itemElements[config.accessProperty].mdn_url || "",
      parent: item,
      type: ItemType.File,
      breadcrumbs: [...item.breadcrumbs, item.name]
    });

    itemElements && delete itemElements[config.accessProperty];
  }

  private addElements(data: Item[], itemElements: any, item: Item): void {
    for (let prop in itemElements) {
      let element = itemElements[prop];

      if (!element.hasOwnProperty(config.accessProperty)) {
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
        element = element[config.accessProperty];

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

  private normalizeItemName(name: string): string {
    return name
      .replace(".json", "")
      .split(/(?=[A-Z][a-z])/)
      .join(" ");
  }
}

export default Parser;
