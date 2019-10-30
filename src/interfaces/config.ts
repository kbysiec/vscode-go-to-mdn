import UrlNormalizer from "./UrlNormalizer";

interface Config {
  regex: RegExp;
  searchUrl: string;
  rootUrl: string;
  allFilesUrl: string;
  urlNormalizer: UrlNormalizer;
  accessProperty: string;
  higherLevelLabel: string;
  cacheKey: string;
  filesCacheKey: string;
}

export default Config;
