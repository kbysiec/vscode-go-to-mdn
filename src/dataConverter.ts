// import { shouldDisplayFlatList } from "./config";
import Item from "./interface/item";
import QuickPickItem from "./interface/quickPickItem";
import { getNameFromQuickPickItem } from "./utils";

const linkIcon = "$(link)";
const directoryIcon = "$(file-directory)";

function mapDataToQpData(
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

export function prepareQpData(data: Item[]): QuickPickItem[] {
  const qpData: QuickPickItem[] = mapDataToQpData(data);
  return qpData;
}

export function mapQpItemToItem(qpItem: QuickPickItem): Item {
  return {
    name: getNameFromQuickPickItem(qpItem),
    url: qpItem.url,
    breadcrumbs: qpItem.breadcrumbs,
  };
}
