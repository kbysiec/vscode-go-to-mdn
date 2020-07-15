import * as vscode from "vscode";
import Item from "./interfaces/item";
import QuickPickItem from "./interfaces/quickPickItem";
import ItemType from "./enums/itemType";
import { appConfig } from "./appConfig";
import Config from "./config";
import Utils from "./utils";

class DataConverter {
  constructor(private config: Config, private utils: Utils) {}

  prepareQpData(data: Item[]): QuickPickItem[] {
    const shouldDisplayFlatListFlag = this.config.shouldDisplayFlatList();
    const qpData: QuickPickItem[] = this.mapDataToQpData(
      data,
      shouldDisplayFlatListFlag
    );
    !shouldDisplayFlatListFlag && this.addBackwardNavigationItem(qpData);
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

  private addBackwardNavigationItem(qpData: QuickPickItem[]): void {
    qpData.unshift({
      label: `$(file-directory) ${appConfig.higherLevelLabel}`,
      description: this.prepareBreadcrumbs(qpData[0]),
      type: ItemType.Directory,
      url: "#",
      breadcrumbs: [],
    });
  }

  private prepareBreadcrumbs(
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
