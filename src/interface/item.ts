import ItemType from "../enum/itemType";

interface Item {
  name: string;
  url: string;
  parent?: Item;
  rootParent?: Item;
  type: ItemType;
  breadcrumbs: string[];
}

export default Item;
