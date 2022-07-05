import { InputData, Item, OutputData, QuickPickItem } from "./types";

const linkIcon = "$(link)";

function mapItemsToQpItems(
  data: Item[],
  isFlat: boolean = false
): QuickPickItem[] {
  return data.map((item: Item) => mapItemToQpItem(item));
}

function getIcon(item: Item): string {
  return linkIcon;
}

function getDescription(item: Item): string {
  return getBreadcrumbs(item);
}

function mapItemToQpItem(item: Item): QuickPickItem {
  const icon = getIcon(item);
  const description = getDescription(item);

  return {
    label: `${icon} ${item.name}`,
    url: item.url,
    breadcrumbs: item.breadcrumbs,
    description,
  };
}

function getBreadcrumbs(item: Item | QuickPickItem): string {
  const breadcrumbs = item.breadcrumbs;
  return breadcrumbs.join(" ");
}

export function prepareOutputData(data: InputData): OutputData {
  const outputData = {
    items: mapItemsToQpItems(data.items),
    count: data.count,
  };
  return outputData;
}
