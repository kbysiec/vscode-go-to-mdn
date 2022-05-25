import { appConfig } from "./appConfig";
import Config from "./config";
import ItemType from "./enum/itemType";
import Item from "./interface/item";
import QuickPickItem from "./interface/quickPickItem";
import Utils from "./utils";

class DataConverter {
  private readonly linkIcon = "$(link)";
  private readonly directoryIcon = "$(file-directory)";

  constructor(private config: Config, private utils: Utils) {}

  prepareQpData(data: Item[], isRootLevel: boolean = false): QuickPickItem[] {
    const shouldDisplayFlatListFlag = this.config.shouldDisplayFlatList();
    const qpData: QuickPickItem[] = this.mapDataToQpData(
      data,
      shouldDisplayFlatListFlag
    );

    this.addBackwardNavigationItemIfNecessary(
      qpData,
      shouldDisplayFlatListFlag,
      isRootLevel
    );

    return qpData;
  }

  mapQpItemToItem(qpItem: QuickPickItem): Item {
    return {
      name: this.utils.getNameFromQuickPickItem(qpItem),
      url: qpItem.url,
      type: qpItem.type,
      parent: qpItem.parent,
      rootParent: qpItem.rootParent,
      breadcrumbs: qpItem.breadcrumbs,
    };
  }

  private mapDataToQpData(
    data: Item[],
    isFlat: boolean = false
  ): QuickPickItem[] {
    return data.map((item: Item) => this.mapItemToQpItem(item, isFlat));
  }

  private getIcon(item: Item): string {
    return item.type === ItemType.Directory
      ? this.directoryIcon
      : this.linkIcon;
  }

  private getDescription(item: Item, isFlat: boolean): string {
    return isFlat ? this.getBreadcrumbs(item, isFlat) : "";
  }

  private mapItemToQpItem(item: Item, isFlat: boolean): QuickPickItem {
    const icon = this.getIcon(item);
    const description = this.getDescription(item, isFlat);

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

  private addBackwardNavigationItem(qpData: QuickPickItem[]): void {
    qpData.unshift({
      label: `${this.directoryIcon} ${appConfig.higherLevelLabel}`,
      description: this.getBreadcrumbs(qpData[0]),
      type: ItemType.Directory,
      url: "#",
      breadcrumbs: [],
    });
  }

  private addBackwardNavigationItemIfNecessary(
    qpData: QuickPickItem[],
    shouldDisplayFlatListFlag: boolean,
    isRootLevel: boolean
  ): void {
    !shouldDisplayFlatListFlag &&
      !isRootLevel &&
      this.addBackwardNavigationItem(qpData);
  }

  private getBreadcrumbs(
    item: Item | QuickPickItem,
    isFlat: boolean = false
  ): string {
    const breadcrumbs = isFlat
      ? item.breadcrumbs
      : [...item.breadcrumbs].slice(0, -1);
    return breadcrumbs.join(`${isFlat ? " " : " / "}`);
  }
}

export default DataConverter;
