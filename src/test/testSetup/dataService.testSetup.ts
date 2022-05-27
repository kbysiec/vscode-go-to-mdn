import * as cache from "../../cache";
import * as config from "../../config";
import * as dataConverter from "../../dataConverter";
import * as dataDownloader from "../../dataDownloader";
import * as dataService from "../../dataService";
import * as mock from "../mock/dataService.mock";
import { restoreStubbedMultiple, stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  return {
    getFlatQuickPickData1: () => {
      stubMultiple([
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
      ]);
    },
    getFlatQuickPickData2: () => {
      restoreStubbedMultiple([
        { object: config, method: "shouldDisplayFlatList" },
        { object: cache, method: "getFlatData" },
      ]);

      stubMultiple([
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
      ]);
    },
    getFlatQuickPickData3: () => {
      restoreStubbedMultiple([
        { object: config, method: "shouldDisplayFlatList" },
        { object: cache, method: "getFlatData" },
        { object: cache, method: "updateFlatData" },
        {
          object: config,
          method: "getGithubPersonalAccessToken",
        },
        {
          object: dataDownloader,
          method: "downloadFlatData",
        },
      ]);

      return stubMultiple([
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
      ]);
    },
    getQuickPickRootData1: () => {
      stubMultiple([
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
      ]);
    },
    getQuickPickData1: () => {
      stubMultiple([
        {
          object: dataService,
          method: "higherLevelData",
          returns: [mock.qpItems],
          isNotMethod: true,
        },
      ]);
    },
    getQuickPickData2: () => {
      stubMultiple([
        {
          object: dataService,
          method: "getLowerLevelQpData",
          returns: mock.qpItems,
        },
      ]);
    },
    getQuickPickData3: () => {
      stubMultiple([
        {
          object: dataService,
          method: "getTreeData",
          returns: mock.qpItems,
        },
      ]);
    },
    getQuickPickData4: () => {
      restoreStubbedMultiple([
        { object: dataConverter, method: "prepareQpData" },
        { object: dataDownloader, method: "downloadTreeData" },
        { object: cache, method: "updateTreeDataByItem" },
        { object: cache, method: "getTreeDataByItem" },
      ]);
      stubMultiple([
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
      ]);
    },
    getQuickPickData5: () => {
      restoreStubbedMultiple([
        { object: cache, method: "getTreeDataByItem" },
        { object: dataConverter, method: "prepareQpData" },
      ]);
      stubMultiple([
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
      ]);
    },
    rememberHigherLevelQpData1: () => {
      stubMultiple([
        {
          object: dataService,
          method: "higherLevelData",
          returns: [],
          isNotMethod: true,
        },
      ]);
    },
    isHigherLevelDataEmpty1: () => {
      stubMultiple([
        {
          object: dataService,
          method: "higherLevelData",
          returns: [mock.qpItems],
          isNotMethod: true,
        },
      ]);
    },
  };
};
