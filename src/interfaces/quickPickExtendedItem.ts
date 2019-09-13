import { QuickPickItem } from "vscode";
import Item from "./item";
import ItemType from "src/enums/itemType";

interface QuickPickExtendedItem extends QuickPickItem {
  url: string;
  type: ItemType;
  parent?: Item;
  rootParent?: Item;
  breadcrumbs: Array<string>;
}

export default QuickPickExtendedItem;
