import * as vscode from "vscode";
import * as sinon from "sinon";
import { appConfig } from "../../appConfig";
import { stubMultiple } from "../util/stubHelpers";
import * as mock from "../mock/cache.mock";

export const getTestSetups = (context: vscode.ExtensionContext) => {
  let updateStub: sinon.SinonStub;

  return {
    beforeEach: () => {
      stubMultiple([
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
      ]);

      updateStub = sinon.stub();
      context.globalState.update = updateStub;

      return updateStub;
    },
    updateTreeDataByItem1: () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: undefined,
        },
      ]);
    },
    updateTreeDataByItem2: () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: {},
        },
      ]);
    },
    getFlatData1: () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: mock.items,
        },
      ]);
    },
    getFlatData2: () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: undefined,
        },
      ]);
    },
    getTreeDataByItem1: () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: {
            [appConfig.rootUrl]: mock.items,
          },
        },
      ]);
    },
    getTreeDataByItem2: () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: {
            [mock.qpItem.url]: mock.items,
          },
        },
      ]);
    },
    getTreeDataByItem3: () => {
      stubMultiple([
        {
          object: context.globalState,
          method: "get",
          returns: undefined,
        },
      ]);
    },
  };
};
