import * as sinon from "sinon";
import * as cache from "../../cache";
import * as config from "../../config";
import * as dataConverter from "../../dataConverter";
import * as dataDownloader from "../../dataDownloader";
import * as dataService from "../../dataService";
import * as utils from "../../utils";
import * as mock from "../mock/dataService.mock";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();

  return {
    afterEach: () => {
      sandbox.restore();
    },
    getFlatQuickPickData1: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: true,
          },
          {
            object: cache,
            method: "getFlatData",
            returns: mock.items,
          },
          {
            object: dataConverter,
            method: "prepareQpData",
            returns: mock.qpItems,
          },
        ],
        sandbox
      );
    },
    getFlatQuickPickData2: () => {
      stubMultiple(
        [
          {
            object: cache,
            method: "getFlatData",
            returns: [],
          },
          {
            object: dataDownloader,
            method: "downloadFlatData",
            returns: Promise.resolve(mock.items),
          },
          {
            object: dataConverter,
            method: "prepareQpData",
            returns: mock.qpItems,
          },
          {
            object: cache,
            method: "updateFlatData",
          },
          {
            object: config,
            method: "getGithubPersonalAccessToken",
            returns: "sample token",
          },
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: true,
          },
          {
            object: utils,
            method: "removeDataWithEmptyUrl",
          },
        ],
        sandbox
      );
    },
    getFlatQuickPickData3: () => {
      return stubMultiple(
        [
          {
            object: dataService,
            method: "cacheFlatFilesWithProgressTask",
          },
          {
            object: cache,
            method: "getFlatData",
            returns: undefined,
          },
          {
            object: dataDownloader,
            method: "downloadFlatData",
            returns: Promise.resolve(mock.items),
          },
          {
            object: cache,
            method: "updateFlatData",
          },
          {
            object: config,
            method: "getGithubPersonalAccessToken",
            returns: "sample token",
          },
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: false,
          },
        ],
        sandbox
      );
    },
    getQuickPickRootData1: () => {
      stubMultiple(
        [
          {
            object: cache,
            method: "getTreeDataByItem",
          },
          {
            object: cache,
            method: "updateTreeDataByItem",
          },
          {
            object: dataDownloader,
            method: "downloadTreeData",
            returns: Promise.resolve(mock.items),
          },
          {
            object: dataConverter,
            method: "prepareQpData",
            returns: mock.qpItems,
          },
        ],
        sandbox
      );
    },
    getQuickPickData1: () => {
      stubMultiple(
        [
          {
            object: dataService,
            method: "higherLevelData",
            returns: [mock.qpItems],
            isNotMethod: true,
          },
          {
            object: utils,
            method: "getNameFromQuickPickItem",
            returns: "..",
          },
          {
            object: dataConverter,
            method: "prepareQpData",
            returns: mock.qpItems,
          },
        ],
        sandbox
      );
    },
    getQuickPickData2: () => {
      stubMultiple(
        [
          {
            object: cache,
            method: "getTreeDataByItem",
            returns: mock.items,
          },
          {
            object: utils,
            method: "getNameFromQuickPickItem",
          },
          {
            object: utils,
            method: "removeDataWithEmptyUrl",
            returns: mock.qpItems,
          },
          {
            object: dataConverter,
            method: "prepareQpData",
            returns: mock.qpItems,
          },
        ],
        sandbox
      );
    },
    getQuickPickData3: () => {
      stubMultiple(
        [
          {
            object: cache,
            method: "getTreeDataByItem",
            returns: mock.items,
          },
          {
            object: utils,
            method: "getNameFromQuickPickItem",
          },
          {
            object: utils,
            method: "removeDataWithEmptyUrl",
            returns: mock.qpItems,
          },
          {
            object: dataConverter,
            method: "prepareQpData",
            returns: mock.qpItems,
          },
        ],
        sandbox
      );
    },
    getQuickPickData4: () => {
      stubMultiple(
        [
          {
            object: cache,
            method: "getTreeDataByItem",
            returns: [],
          },
          {
            object: dataDownloader,
            method: "downloadTreeData",
            returns: Promise.resolve(mock.items),
          },
          {
            object: cache,
            method: "updateTreeDataByItem",
          },
          {
            object: dataConverter,
            method: "prepareQpData",
            returns: mock.qpItems,
          },
          {
            object: utils,
            method: "getNameFromQuickPickItem",
          },
          {
            object: utils,
            method: "removeDataWithEmptyUrl",
            returns: mock.qpItems,
          },
          {
            object: dataConverter,
            method: "mapQpItemToItem",
            customReturns: true,
            returns: [
              {
                onCall: 0,
                returns: mock.qpItems[0],
              },
              {
                onCall: 1,
                returns: mock.qpItems[1],
              },
              {
                onCall: 2,
                returns: mock.qpItems[2],
              },
            ],
          },
        ],
        sandbox
      );
    },
    getQuickPickData5: () => {
      stubMultiple(
        [
          {
            object: cache,
            method: "getTreeDataByItem",
            returns: mock.items,
          },
          {
            object: dataConverter,
            method: "prepareQpData",
            returns: mock.qpItems,
          },
          {
            object: utils,
            method: "getNameFromQuickPickItem",
          },
          {
            object: utils,
            method: "removeDataWithEmptyUrl",
            returns: mock.qpItems,
          },
        ],
        sandbox
      );
    },
    rememberHigherLevelQpData1: () => {
      stubMultiple(
        [
          {
            object: dataService,
            method: "higherLevelData",
            returns: [],
            isNotMethod: true,
          },
        ],
        sandbox
      );
    },
    isHigherLevelDataEmpty1: () => {
      stubMultiple(
        [
          {
            object: dataService,
            method: "higherLevelData",
            returns: [mock.qpItems],
            isNotMethod: true,
          },
        ],
        sandbox
      );
    },
  };
};
