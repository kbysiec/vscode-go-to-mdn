export const appConfig = {
  regex: /https:\/\/github\.com\/mdn\/browser-compat-data\/tree\/master\/[a-zA-Z]+/gm,
  searchUrl: "https://developer.mozilla.org/en-US/search",
  rootUrl:
    "https://api.github.com/repos/mdn/browser-compat-data/contents/README.md?ref=master",
  allFilesUrl: "http://vscodegotomdnapi.agileplayers.com/get",
  urlNormalizer: {
    from: "https://github.com/",
    to: "https://api.github.com/",
    queryString: "?ref=master",
  },
  accessProperty: "__compat",
  higherLevelLabel: "..",
  treeCacheKey: "treeData",
  flatCacheKey: "flatData",
};
