import { appConfig } from "./appConfig";
import Item from "./interface/item";
import { OutputData } from "./interface/outputData";

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

export function parseData(json: any): OutputData {
  const jsonAsString = JSON.stringify(json);
  const urlsAsString = JSON.stringify(jsonAsString.match(appConfig.dataRegex));
  const urls: string[] = JSON.parse(urlsAsString);
  const outputData: OutputData = {
    items: urls ? urls.map((item) => parseItem(item)) : [],
    count: urls ? urls.length : 0,
  };
  return outputData;
}
