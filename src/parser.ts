import { appConfig } from "./appConfig";
import ItemType from "./enum/itemType";
import Item from "./interface/item";

function parseFlatElement(item: any): Item {
  return createItem(
    item.name,
    item.url,
    ItemType.File,
    [...item.breadcrumbs],
    item.parent || undefined
  );
}

function parseRootDirectory(item: any): Item {
  const url = normalizeUrl(item);
  const name = getNameFromUrl(url);

  return createItem(name, url, ItemType.Directory, [name]);
}

function parseDirectory(item: any, url: string): Item {
  let name = getNameFromUrl(url);
  name = normalizeItemName(name);

  return createItem(
    name,
    url,
    ItemType.Directory,
    [...item.breadcrumbs, name],
    item,
    item.parent || item
  );
}

function normalizeUrl(url: string): string {
  const splitPathName = getPathNameSplit(url);
  return `${appConfig.urlNormalizer.to}repos/${splitPathName[0]}/${splitPathName[1]}/contents/${splitPathName[4]}${appConfig.urlNormalizer.queryString}`;
}

function getNameFromUrl(url: string): string {
  const splitPathName = getPathNameSplit(url);
  return splitPathName[splitPathName.length - 1];
}

function getPathNameSplit(url: string): string[] {
  return url
    .replace(appConfig.urlNormalizer.from, "")
    .replace(appConfig.urlNormalizer.to, "")
    .replace(appConfig.urlNormalizer.queryString, "")
    .split("/");
}

function getItemElementsAtFirstItemLevel(itemElements: any): any {
  while (ifItemElementsHaveNotAccessProperty(itemElements)) {
    const propertyName = Object.keys(itemElements)[0] || "";
    itemElements = itemElements[propertyName];
  }
  return itemElements;
}

function ifItemElementsHaveNotAccessProperty(itemElements: any): boolean {
  return (
    itemElements &&
    !Object.hasOwnProperty.call(itemElements, appConfig.accessProperty)
  );
}

function addReferenceElement(
  data: Item[],
  itemElements: any,
  item: Item
): void {
  data.push(
    createItem(
      `${item.name} - reference`,
      getUrlForReferenceElement(itemElements),
      ItemType.File,
      [...item.breadcrumbs, item.name],
      item
    )
  );

  itemElements && delete itemElements[appConfig.accessProperty];
}

function getUrlForReferenceElement(itemElements: any): string {
  return (
    (itemElements &&
      itemElements[appConfig.accessProperty] &&
      itemElements[appConfig.accessProperty].mdn_url) ||
    ""
  );
}

function addElements(data: Item[], itemElements: any, item: Item): void {
  for (let prop in itemElements) {
    let element = itemElements[prop];

    !element.hasOwnProperty(appConfig.accessProperty)
      ? addLowestLevelElements(data, element, item)
      : addLowestLevelElement(data, element, item, prop);
  }
}

function addLowestLevelElements(data: Item[], element: any, item: Item) {
  for (let innerProp in element) {
    let innerElement = element[innerProp];
    data.push(addElement(innerElement, innerProp, item));
  }
}

function addLowestLevelElement(
  data: Item[],
  element: any,
  item: Item,
  prop: string
) {
  element = element[appConfig.accessProperty];
  data.push(addElement(element, prop, item));
}

function addElement(element: any, prop: string, item: Item): Item {
  const name = normalizeItemName(prop);

  return createItem(
    name,
    element.mdn_url || "",
    ItemType.File,
    [...item.breadcrumbs, name],
    item
  );
}

function normalizeItemName(name: string): string {
  return name
    .replace(".json", "")
    .split(/(?=[A-Z][a-z])/)
    .join(" ");
}

function createItem(
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

export function parseFlatElements(json: any): Item[] {
  return json.items
    ? json.items.map((item: any) => parseFlatElement(item))
    : [];
}

export function parseRootDirectories(content: any): Item[] {
  const results = content.match(appConfig.regex) || [];
  return results.map((item: any) => parseRootDirectory(item));
}

export function parseElements(content: any, item: Item): Item[] {
  const data: Item[] = [];
  let itemElements = JSON.parse(content);

  if (!item.parent) {
    return data;
  }

  itemElements = getItemElementsAtFirstItemLevel(itemElements);
  addReferenceElement(data, itemElements, item);
  addElements(data, itemElements, item);

  return data;
}

export function parseDirectories(content: any, item: Item): Item[] {
  return content.map((el: any) => parseDirectory(item, el.url));
}
