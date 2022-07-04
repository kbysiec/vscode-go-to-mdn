export const appConfig = {
  searchUrl: "https://developer.mozilla.org/en-US/search",
  inputDataUrl: "https://unpkg.com/@mdn/browser-compat-data/data.json",
  dataRegex: /"mdn_url":"https:\/\/developer.mozilla.org([^,|"]+)/g,
  reduntantUrlPartForBreadcrumbs: "https://developer.mozilla.org/docs/",
  cacheKey: "data",
};
