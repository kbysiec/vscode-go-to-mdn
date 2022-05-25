import ItemType from "src/enum/itemType";
import { QuickPickItem as QuickPickItemVscode } from "vscode";
import Item from "./item";

interface QuickPickItem extends QuickPickItemVscode {
  url: string;
  type: ItemType;
  parent?: Item;
  rootParent?: Item;
  breadcrumbs: string[];
}

export default QuickPickItem;
