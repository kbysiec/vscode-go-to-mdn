import DataService from "../../dataService";
import * as mock from "../mock/dataService.mock";
import { restoreStubbedMultiple, stubMultiple } from "../util/stubHelpers";

export const getTestSetups = (dataService: DataService) => {
  const dataServiceAny = dataService as any;

  return {
    getFlatQuickPickData1: () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.config, method: "shouldDisplayFlatList" },
        { object: dataServiceAny.cache, method: "getFlatData" },
      ]);

      stubMultiple([
        {
          object: dataServiceAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
        {
          object: dataServiceAny.cache,
          method: "getFlatData",
          returns: mock.items,
        },
      ]);
    },
    getFlatQuickPickData2: () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.config, method: "shouldDisplayFlatList" },
        { object: dataServiceAny.cache, method: "getFlatData" },
        { object: dataServiceAny.cache, method: "updateFlatData" },
        {
          object: dataServiceAny.config,
          method: "getGithubPersonalAccessToken",
        },
      ]);

      stubMultiple([
        {
          object: dataServiceAny.cache,
          method: "getFlatData",
          returns: [],
        },
        {
          object: dataServiceAny.dataDownloader,
          method: "downloadFlatData",
          returns: Promise.resolve(mock.items),
        },
        {
          object: dataServiceAny.dataConverter,
          method: "prepareQpData",
          returns: mock.qpItems,
        },
        {
          object: dataServiceAny.cache,
          method: "updateFlatData",
        },
        {
          object: dataServiceAny.config,
          method: "getGithubPersonalAccessToken",
          returns: "sample token",
        },
        {
          object: dataServiceAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
      ]);
    },
    getFlatQuickPickData3: () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.config, method: "shouldDisplayFlatList" },
        { object: dataServiceAny.cache, method: "getFlatData" },
        { object: dataServiceAny.cache, method: "updateFlatData" },
        {
          object: dataServiceAny.config,
          method: "getGithubPersonalAccessToken",
        },
      ]);

      return stubMultiple([
        {
          object: dataServiceAny,
          method: "cacheFlatFilesWithProgressTask",
        },
        {
          object: dataServiceAny.cache,
          method: "getFlatData",
          returns: undefined,
        },
        {
          object: dataServiceAny.dataDownloader,
          method: "downloadFlatData",
          returns: Promise.resolve(mock.items),
        },
        {
          object: dataServiceAny.cache,
          method: "updateFlatData",
        },
        {
          object: dataServiceAny.config,
          method: "getGithubPersonalAccessToken",
          returns: "sample token",
        },
        {
          object: dataServiceAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
      ]);
    },
    getQuickPickRootData1: () => {
      stubMultiple([
        {
          object: dataServiceAny,
          method: "getTreeData",
          returns: mock.qpItems,
        },
      ]);
    },
    getQuickPickData1: () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.utils, method: "getNameFromQuickPickItem" },
      ]);

      stubMultiple([
        {
          object: dataServiceAny.utils,
          method: "getNameFromQuickPickItem",
          returns: "..",
        },
        {
          object: dataServiceAny,
          method: "higherLevelData",
          returns: [mock.qpItems],
          isNotMethod: true,
        },
      ]);
    },
    getQuickPickData2: () => {
      stubMultiple([
        {
          object: dataServiceAny,
          method: "getLowerLevelQpData",
          returns: mock.qpItems,
        },
      ]);
    },
    getQuickPickData3: () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.utils, method: "removeDataWithEmptyUrl" },
      ]);

      stubMultiple([
        {
          object: dataServiceAny.utils,
          method: "removeDataWithEmptyUrl",
          returns: mock.qpItems,
        },
        {
          object: dataServiceAny,
          method: "getTreeData",
          returns: mock.qpItems,
        },
      ]);
    },
    getQuickPickData4: () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.utils, method: "removeDataWithEmptyUrl" },
        { object: dataServiceAny.cache, method: "updateTreeDataByItem" },
        { object: dataServiceAny.cache, method: "getTreeDataByItem" },
      ]);
      stubMultiple([
        {
          object: dataServiceAny.cache,
          method: "getTreeDataByItem",
          returns: [],
        },
        {
          object: dataServiceAny.dataDownloader,
          method: "downloadTreeData",
          returns: Promise.resolve(mock.items),
        },
        {
          object: dataServiceAny.cache,
          method: "updateTreeDataByItem",
        },
        {
          object: dataServiceAny.dataConverter,
          method: "prepareQpData",
          returns: mock.qpItems,
        },
        {
          object: dataServiceAny.utils,
          method: "removeDataWithEmptyUrl",
          returns: mock.qpItems,
        },
      ]);
    },
    getQuickPickData5: () => {
      restoreStubbedMultiple([
        { object: dataServiceAny.utils, method: "removeDataWithEmptyUrl" },
        { object: dataServiceAny.cache, method: "getTreeDataByItem" },
      ]);
      stubMultiple([
        {
          object: dataServiceAny.cache,
          method: "getTreeDataByItem",
          returns: mock.items,
        },
        {
          object: dataServiceAny.dataConverter,
          method: "prepareQpData",
          returns: mock.qpItems,
        },
        {
          object: dataServiceAny.utils,
          method: "removeDataWithEmptyUrl",
          returns: mock.qpItems,
        },
      ]);
    },
    rememberHigherLevelQpData1: () => {
      stubMultiple([
        {
          object: dataServiceAny,
          method: "higherLevelData",
          returns: [],
          isNotMethod: true,
        },
      ]);
    },
    isHigherLevelDataEmpty1: () => {
      stubMultiple([
        {
          object: dataServiceAny,
          method: "higherLevelData",
          returns: [mock.qpItems],
          isNotMethod: true,
        },
      ]);
    },
  };
};
