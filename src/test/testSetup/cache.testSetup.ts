import * as sinon from "sinon";
import { appConfig } from "../../appConfig";
import * as mock from "../mock/cache.mock";
import { getExtensionContext } from "../util/mockFactory";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const context = getExtensionContext();
  const sandbox = sinon.createSandbox();

  return {
    before: () => {
      stubMultiple(
        [
          {
            object: appConfig,
            method: "flatCacheKey",
            returns: "flatData",
            isNotMethod: true,
          },
          {
            object: appConfig,
            method: "treeCacheKey",
            returns: "treeData",
            isNotMethod: true,
          },
          {
            object: appConfig,
            method: "rootUrl",
            returns:
              "https://api.github.com/repos/mdn/browser-compat-data/contents/README.md?ref=main",
            isNotMethod: true,
          },
        ],
        sandbox
      );

      return context;
    },
    afterEach: () => {
      sandbox.restore();
    },
    updateFlatData1: () => {
      return stubMultiple(
        [
          {
            object: context.globalState,
            method: "update",
          },
        ],
        sandbox
      );
    },
    updateTreeDataByItem1: () => {
      return stubMultiple(
        [
          {
            object: context.globalState,
            method: "update",
          },
          {
            object: context.globalState,
            method: "get",
            returns: undefined,
          },
        ],
        sandbox
      );
    },
    updateTreeDataByItem2: () => {
      return stubMultiple(
        [
          {
            object: context.globalState,
            method: "update",
          },
          {
            object: context.globalState,
            method: "get",
            returns: {},
          },
        ],
        sandbox
      );
    },
    getFlatData1: () => {
      stubMultiple(
        [
          {
            object: context.globalState,
            method: "get",
            returns: mock.items,
          },
        ],
        sandbox
      );
    },
    getFlatData2: () => {
      stubMultiple(
        [
          {
            object: context.globalState,
            method: "get",
            returns: undefined,
          },
        ],
        sandbox
      );
    },
    getTreeDataByItem1: () => {
      stubMultiple(
        [
          {
            object: context.globalState,
            method: "get",
            returns: {
              [appConfig.rootUrl]: mock.items,
            },
          },
        ],
        sandbox
      );
    },
    getTreeDataByItem2: () => {
      stubMultiple(
        [
          {
            object: context.globalState,
            method: "get",
            returns: {
              [mock.qpItem.url]: mock.items,
            },
          },
        ],
        sandbox
      );
    },
    getTreeDataByItem3: () => {
      stubMultiple(
        [
          {
            object: context.globalState,
            method: "get",
            returns: undefined,
          },
        ],
        sandbox
      );
    },
    clearCache1: () => {
      return stubMultiple(
        [
          {
            object: context.globalState,
            method: "update",
          },
        ],
        sandbox
      );
    },
  };
};
