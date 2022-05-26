import { appConfig } from "./appConfig";
import { shouldDisplayFlatList } from "./config";
import ItemType from "./enum/itemType";
import Item from "./interface/item";
import QuickPickItem from "./interface/quickPickItem";
import { getNameFromQuickPickItem } from "./utils";

const linkIcon = "$(link)";
const directoryIcon = "$(file-directory)";

function mapDataToQpData(
  data: Item[],
  isFlat: boolean = false
): QuickPickItem[] {
  return data.map((item: Item) => mapItemToQpItem(item, isFlat));
}

function getIcon(item: Item): string {
  return item.type === ItemType.Directory ? directoryIcon : linkIcon;
}

function getDescription(item: Item, isFlat: boolean): string {
  return isFlat ? getBreadcrumbs(item, isFlat) : "";
}

function mapItemToQpItem(item: Item, isFlat: boolean): QuickPickItem {
  const icon = getIcon(item);
  const description = getDescription(item, isFlat);

  return {
    label: `${icon} ${item.name}`,
    url: item.url,
    parent: item.parent,
    rootParent: item.rootParent,
    type: item.type,
    breadcrumbs: item.breadcrumbs,
    description,
  };
}

function addBackwardNavigationItem(qpData: QuickPickItem[]): void {
  qpData.unshift({
    label: `${directoryIcon} ${appConfig.higherLevelLabel}`,
    description: getBreadcrumbs(qpData[0]),
    type: ItemType.Directory,
    url: "#",
    breadcrumbs: [],
  });
}

function addBackwardNavigationItemIfNecessary(
  qpData: QuickPickItem[],
  shouldDisplayFlatListFlag: boolean,
  isRootLevel: boolean
): void {
  !shouldDisplayFlatListFlag &&
    !isRootLevel &&
    addBackwardNavigationItem(qpData);
}

function getBreadcrumbs(
  item: Item | QuickPickItem,
  isFlat: boolean = false
): string {
  const breadcrumbs = isFlat
    ? item.breadcrumbs
    : [...item.breadcrumbs].slice(0, -1);
  return breadcrumbs.join(`${isFlat ? " " : " / "}`);
}

export function prepareQpData(
  data: Item[],
  isRootLevel: boolean = false
): QuickPickItem[] {
  const shouldDisplayFlatListFlag = shouldDisplayFlatList();
  const qpData: QuickPickItem[] = mapDataToQpData(
    data,
    shouldDisplayFlatListFlag
  );

  addBackwardNavigationItemIfNecessary(
    qpData,
    shouldDisplayFlatListFlag,
    isRootLevel
  );

  return qpData;
}

export function mapQpItemToItem(qpItem: QuickPickItem): Item {
  return {
    name: getNameFromQuickPickItem(qpItem),
    url: qpItem.url,
    type: qpItem.type,
    parent: qpItem.parent,
    rootParent: qpItem.rootParent,
    breadcrumbs: qpItem.breadcrumbs,
  };
}
