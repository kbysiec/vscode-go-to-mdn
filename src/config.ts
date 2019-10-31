export const config = {
  regex: /https:\/\/github\.com\/mdn\/browser-compat-data\/tree\/master\/[a-zA-Z]+/gm,
  searchUrl: "https://developer.mozilla.org/en-US/search",
  rootUrl:
    "https://api.github.com/repos/mdn/browser-compat-data/contents/README.md?ref=master",
  allFilesUrl: "http://api.agileplayers.com/api/mdn-data",
  urlNormalizer: {
    from: "https://github.com/",
    to: "https://api.github.com/",
    queryString: "?ref=master"
  },
  accessProperty: "__compat",
  higherLevelLabel: "..",
  cacheKey: "cache",
  filesCacheKey: "filesCache"
};
