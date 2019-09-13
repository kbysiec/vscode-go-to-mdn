import ItemType from "../enums/itemType";

interface Item {
  name: string;
  url: string;
  parent?: Item;
  rootParent?: Item;
  type: ItemType;
  breadcrumbs: Array<string>;
}

export default Item;
