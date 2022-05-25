import { appConfig } from "../../appConfig";
import QuickPick from "../../quickPick";
import * as mock from "../mock/quickPick.mock";
import { restoreStubbedMultiple, stubMultiple } from "../util/stubHelpers";

export const getTestSetups = (quickPick: QuickPick) => {
  const quickPickAny = quickPick as any;

  return {
    registerEventListeners1: () => {
      return stubMultiple([
        {
          object: quickPickAny.quickPick,
          method: "onDidHide",
        },
        { object: quickPickAny.quickPick, method: "onDidAccept" },
      ]);
    },
    registerEventListeners2: () => {
      return stubMultiple([
        { object: quickPickAny.quickPick, method: "onDidChangeValue" },
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
      ]);
    },
    registerEventListeners3: () => {
      return stubMultiple([
        { object: quickPickAny.quickPick, method: "onDidChangeValue" },
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
      ]);
    },
    show1: () => {
      return stubMultiple([{ object: quickPickAny.quickPick, method: "show" }]);
    },
    hide1: () => {
      return stubMultiple([{ object: quickPickAny.quickPick, method: "hide" }]);
    },
    loadQuickPickData1: () => {
      stubMultiple([
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: true,
        },
        {
          object: quickPickAny.dataService,
          method: "getFlatQuickPickData",
          returns: Promise.resolve(mock.qpItems),
        },
      ]);
    },
    loadQuickPickData2: () => {
      stubMultiple([
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
        {
          object: quickPickAny.dataService,
          method: "getQuickPickData",
          returns: Promise.resolve(mock.qpItems),
        },
      ]);
    },
    loadQuickPickData3: () => {
      stubMultiple([
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
        {
          object: quickPickAny.dataService,
          method: "getQuickPickRootData",
          returns: Promise.resolve(mock.qpItems),
        },
      ]);
    },
    loadQuickPickData4: () => {
      stubMultiple([
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
        {
          object: quickPickAny.dataService,
          method: "isHigherLevelDataEmpty",
          returns: false,
        },
        {
          object: quickPickAny.dataService,
          method: "getQuickPickRootData",
          returns: Promise.resolve(mock.qpItems),
        },
      ]);
    },
    loadQuickPickData5: () => {
      stubMultiple([
        {
          object: quickPickAny.config,
          method: "shouldDisplayFlatList",
          returns: false,
        },
        {
          object: quickPickAny.dataService,
          method: "isHigherLevelDataEmpty",
          returns: true,
        },
        {
          object: quickPickAny.dataService,
          method: "getQuickPickRootData",
          returns: Promise.resolve(mock.qpItems),
        },
      ]);
    },
    submit1: () => {
      restoreStubbedMultiple([
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
        },
        {
          object: quickPickAny.utils,
          method: "isValueFileType",
        },
      ]);

      return stubMultiple([
        {
          object: quickPickAny,
          method: "open",
          returns: Promise.resolve(),
        },
        {
          object: quickPickAny.dataService,
          method: "isHigherLevelDataEmpty",
          returns: true,
        },
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
          returns: false,
        },
        {
          object: quickPickAny.utils,
          method: "isValueFileType",
          returns: true,
        },
      ]);
    },
    submit2: () => {
      restoreStubbedMultiple([
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
        },
        {
          object: quickPickAny.utils,
          method: "getSearchUrl",
        },
      ]);

      return stubMultiple([
        {
          object: quickPickAny,
          method: "open",
          returns: Promise.resolve(),
        },
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
          returns: true,
        },
        {
          object: quickPickAny.dataService,
          method: "isHigherLevelDataEmpty",
          returns: true,
        },
        {
          object: quickPickAny.quickPick,
          method: "value",
          returns: "test search text",
          isNotMethod: true,
        },
        {
          object: appConfig,
          method: "searchUrl",
          returns: "https://developer.mozilla.org/search",
          isNotMethod: true,
        },
        {
          object: quickPickAny.utils,
          method: "getSearchUrl",
          returns: "https://developer.mozilla.org/search?q=test+search+text",
        },
      ]);
    },
    submit3: () => {
      restoreStubbedMultiple([
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
        },
      ]);

      return stubMultiple([
        {
          object: quickPickAny,
          method: "openInBrowser",
          returns: Promise.resolve(),
        },
        {
          object: appConfig,
          method: "searchUrl",
          returns: "https://developer.mozilla.org/search",
          isNotMethod: true,
        },
        {
          object: quickPickAny.dataService,
          method: "isHigherLevelDataEmpty",
          returns: false,
        },
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
          returns: true,
        },
        {
          object: quickPickAny.quickPick,
          method: "value",
          returns: "test search text",
          isNotMethod: true,
        },
      ]);
    },
    submit4: () => {
      restoreStubbedMultiple([
        { object: quickPickAny.utils, method: "isValueStringType" },
        { object: quickPickAny.utils, method: "isValueFileType" },
      ]);

      return stubMultiple([
        {
          object: quickPickAny,
          method: "openInBrowser",
          returns: Promise.resolve(),
        },
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
          returns: false,
        },
        {
          object: quickPickAny.utils,
          method: "isValueFileType",
          returns: true,
        },
      ]);
    },
    submit5: () => {
      return stubMultiple([
        {
          object: quickPickAny,
          method: "loadQuickPickData",
          returns: Promise.resolve(),
        },
      ]);
    },
    submit6: () => {
      restoreStubbedMultiple([
        { object: quickPickAny.utils, method: "isValueStringType" },
        { object: quickPickAny.utils, method: "printErrorMessage" },
      ]);

      return stubMultiple([
        { object: quickPickAny.utils, method: "printErrorMessage" },
        {
          object: quickPickAny.utils,
          method: "isValueStringType",
          returns: true,
        },
        {
          object: quickPickAny,
          method: "processIfValueIsStringType",
          throws: "test error message",
        },
      ]);
    },
    onDidAccept1: () => {
      return stubMultiple([
        { object: quickPickAny, method: "submit" },
        {
          object: quickPickAny.quickPick,
          method: "selectedItems",
          returns: [mock.qpItem],
          isNotMethod: true,
        },
      ]);
    },
    onDidHide1: () => {
      return stubMultiple([{ object: quickPickAny, method: "clearText" }]);
    },
    onWillGoLowerTreeLevel1: () => {
      return stubMultiple([
        {
          object: quickPickAny.dataService,
          method: "rememberHigherLevelQpData",
        },
        {
          object: quickPickAny.quickPick,
          method: "items",
          returns: mock.qpItems,
          isNotMethod: true,
        },
      ]);
    },
  };
};
