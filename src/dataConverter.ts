import * as vscode from "vscode";
import Item from "./interfaces/item";
import QuickPickExtendedItem from "./interfaces/quickPickExtendedItem";
import ItemType from "./enums/itemType";
import { appConfig } from "./appConfig";
import Utils from "./utils";

class DataConverter {
  constructor(private utils: Utils) {}

  prepareQpData(data: Item[]): QuickPickExtendedItem[] {
    const shouldDisplayFlatListFlag = this.utils.shouldDisplayFlatList();
    const qpData: QuickPickExtendedItem[] = this.mapDataToQpData(
      data,
      shouldDisplayFlatListFlag
    );
    !shouldDisplayFlatListFlag && this.addBackwardNavigationItem(qpData);
    return qpData;
  }

  mapQpItemToItem(qpItem: QuickPickExtendedItem): Item {
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
  ): QuickPickExtendedItem[] {
    return data.map((el) => {
      const icon =
        el.type === ItemType.Directory ? "$(file-directory)" : "$(link)";
      const description = isFlat
        ? this.prepareBreadcrumbs(el, isFlat)
        : undefined;
      return {
        label: `${icon} ${el.name}`,
        url: el.url,
        parent: el.parent,
        rootParent: el.rootParent,
        type: el.type,
        breadcrumbs: el.breadcrumbs,
        description,
      };
    });
  }

  private addBackwardNavigationItem(qpData: QuickPickExtendedItem[]): void {
    qpData.unshift({
      label: `$(file-directory) ${appConfig.higherLevelLabel}`,
      description: this.prepareBreadcrumbs(qpData[0]),
      type: ItemType.Directory,
      url: "#",
      breadcrumbs: [],
    });
  }

  private prepareBreadcrumbs(
    item: Item | QuickPickExtendedItem,
    isFlat: boolean = false
  ): string {
    const breadcrumbs = isFlat
      ? item.breadcrumbs
      : [...item.breadcrumbs].slice(0, -1);
    return breadcrumbs.join(`${isFlat ? " " : " / "}`);
  }
}

export default DataConverter;
