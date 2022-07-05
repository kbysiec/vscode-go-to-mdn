import { appConfig } from "./appConfig";
import { InputData, Item, Json } from "./types";

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

function deleteReduntantPropsFromJson(json: Json) {
  const redundantProps = ["__meta", "browsers", "webdriver", "webextensions"];
  redundantProps.forEach((key) => delete json[key]);
}

export function parseData(json: Json): InputData {
  deleteReduntantPropsFromJson(json);
  const jsonAsString = JSON.stringify(json);
  const urlsAsString = JSON.stringify(jsonAsString.match(appConfig.dataRegex));
  const urls: string[] = JSON.parse(urlsAsString);
  const outputData: InputData = {
    items: urls ? urls.map((item) => parseItem(item)) : [],
    count: urls ? urls.length : 0,
  };
  return outputData;
}
