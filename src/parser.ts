import { appConfig } from "./appConfig";
import { InputData } from "./interface/inputData";
import Item from "./interface/item";

function normalizeItemName(name: string): string {
  return name.split(/(?=[A-Z][a-z])/).join(" ");
}

function parseItem(keyValue: string): Item {
  const url = keyValue.replace(`"mdn_url":"`, "");
  const breadcrumbs = url
    .replace(appConfig.reduntantUrlPartForBreadcrumbs, "")
    .split("/");

  return {
    name: normalizeItemName(breadcrumbs[breadcrumbs.length - 1]),
    url,
    breadcrumbs,
  };
}

export function parseData(json: any): InputData {
  const jsonAsString = JSON.stringify(json);
  const urlsAsString = JSON.stringify(jsonAsString.match(appConfig.dataRegex));
  const urls: string[] = JSON.parse(urlsAsString);
  const outputData: InputData = {
    items: urls ? urls.map((item) => parseItem(item)) : [],
    count: urls ? urls.length : 0,
  };
  return outputData;
}
