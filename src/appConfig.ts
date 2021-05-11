export const appConfig = {
  regex:
    /https:\/\/github\.com\/mdn\/browser-compat-data\/tree\/master\/(?!.*\bbrowsers\b)[a-zA-Z]+/gm,
  searchUrl: "https://developer.mozilla.org/en-US/search",
  rootUrl:
    "https://api.github.com/repos/mdn/browser-compat-data/contents/README.md?ref=1446832d245da286fb0d624d595b82ef1a7ce3c9",
  allFilesUrl: "http://vscodegotomdnapi.agileplayers.com/get",
  urlNormalizer: {
    from: "https://github.com/",
    to: "https://api.github.com/",
    queryString: "?ref=main",
  },
  accessProperty: "__compat",
  higherLevelLabel: "..",
  treeCacheKey: "treeData",
  flatCacheKey: "flatData",
};
