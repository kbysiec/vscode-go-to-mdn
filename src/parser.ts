import Item from "./interface/item";

function parseItem(item: any): Item {
  return {
    name: item.name,
    url: item.url,
    breadcrumbs: [...item.breadcrumbs],
  };
}

export function parseData(json: any): Item[] {
  return json.items ? json.items.map((item: any) => parseItem(item)) : [];
}
