import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import { appConfig } from "../../appConfig";
import * as config from "../../config";
import * as dataService from "../../dataService";
import * as quickPickModule from "../../quickPick";
import * as utils from "../../utils";
import * as mock from "../mock/quickPick.mock";
import { stubMultiple } from "../util/stubHelpers";

type quickPickModule = typeof quickPickModule;

const getComponent = (sandbox: sinon.SinonSandbox) => {
  sandbox.stub(config, "shouldDisplayFlatList");
  const openStub = sandbox.stub().returns(Promise.resolve());
  const proxiedModule: quickPickModule = proxyquire("../../quickPick", {
    open: openStub,
  });
  const { createQuickPick } = proxiedModule;
  return {
    quickPick: createQuickPick(),
    stubs: [openStub],
  };
};

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();
  const {
    quickPick,
    stubs: [openStub],
  } = getComponent(sandbox);

  return {
    before: () => {
      return quickPick;
    },
    afterEach: () => {
      sandbox.restore();
    },
    registerEventListeners1: () => {
      return stubMultiple(
        [
          {
            object: quickPick.quickPickControl,
            method: "onDidHide",
          },
          { object: quickPick.quickPickControl, method: "onDidAccept" },
          {
            object: config,
            method: "shouldDisplayFlatList",
          },
        ],
        sandbox
      );
    },
    registerEventListeners2: () => {
      return stubMultiple(
        [
          { object: quickPick.quickPickControl, method: "onDidChangeValue" },
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: false,
          },
        ],
        sandbox
      );
    },
    registerEventListeners3: () => {
      return stubMultiple(
        [
          { object: quickPick.quickPickControl, method: "onDidChangeValue" },
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: true,
          },
        ],
        sandbox
      );
    },
    show1: () => {
      return stubMultiple(
        [{ object: quickPick.quickPickControl, method: "show" }],
        sandbox
      );
    },
    loadQuickPickData1: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: true,
          },
          {
            object: dataService,
            method: "getFlatQuickPickData",
            returns: Promise.resolve(mock.qpItems),
          },
        ],
        sandbox
      );
    },
    loadQuickPickData2: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: false,
          },
          {
            object: dataService,
            method: "getQuickPickData",
            returns: Promise.resolve(mock.qpItems),
          },
        ],
        sandbox
      );
    },
    loadQuickPickData3: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: false,
          },
          {
            object: dataService,
            method: "getQuickPickRootData",
            returns: Promise.resolve(mock.qpItems),
          },
        ],
        sandbox
      );
    },
    loadQuickPickData4: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: false,
          },
          {
            object: dataService,
            method: "isHigherLevelDataEmpty",
            returns: false,
          },
          {
            object: dataService,
            method: "getQuickPickRootData",
            returns: Promise.resolve(mock.qpItems),
          },
        ],
        sandbox
      );
    },
    loadQuickPickData5: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "shouldDisplayFlatList",
            returns: false,
          },
          {
            object: dataService,
            method: "isHigherLevelDataEmpty",
            returns: true,
          },
          {
            object: dataService,
            method: "getQuickPickRootData",
            returns: Promise.resolve(mock.qpItems),
          },
        ],
        sandbox
      );
    },
    submit1: () => {
      return [
        openStub,
        ...stubMultiple(
          [
            {
              object: dataService,
              method: "isHigherLevelDataEmpty",
              returns: true,
            },
            {
              object: utils,
              method: "isValueStringType",
              returns: false,
            },
            {
              object: utils,
              method: "isValueFileType",
              returns: true,
            },
          ],
          sandbox
        ),
      ];
    },
    submit2: () => {
      return [
        openStub,
        ...stubMultiple(
          [
            {
              object: dataService,
              method: "isHigherLevelDataEmpty",
              returns: true,
            },
            {
              object: quickPick.quickPickControl,
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
              object: utils,
              method: "getSearchUrl",
              returns:
                "https://developer.mozilla.org/search?q=test+search+text",
            },
            {
              object: utils,
              method: "isValueStringType",
              returns: true,
            },
            {
              object: utils,
              method: "isValueFileType",
              returns: true,
            },
          ],
          sandbox
        ),
      ];
    },
    submit3: () => {
      return stubMultiple(
        [
          {
            object: quickPick,
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
            object: dataService,
            method: "isHigherLevelDataEmpty",
            returns: false,
          },
          {
            object: quickPick.quickPickControl,
            method: "value",
            returns: "test search text",
            isNotMethod: true,
          },
          {
            object: utils,
            method: "isValueStringType",
            returns: true,
          },
        ],
        sandbox
      );
    },
    submit4: () => {
      return stubMultiple(
        [
          {
            object: quickPick,
            method: "openInBrowser",
            returns: Promise.resolve(),
          },
          {
            object: utils,
            method: "isValueStringType",
            returns: false,
          },
          {
            object: utils,
            method: "isValueFileType",
            returns: true,
          },
        ],
        sandbox
      );
    },
    submit5: () => {
      return stubMultiple(
        [
          {
            object: quickPick,
            method: "loadQuickPickData",
            returns: Promise.resolve(),
          },
          {
            object: utils,
            method: "isValueStringType",
            returns: false,
          },
          {
            object: utils,
            method: "isValueFileType",
            returns: false,
          },
        ],
        sandbox
      );
    },
    submit6: () => {
      return stubMultiple(
        [
          {
            object: utils,
            method: "printErrorMessage",
          },
          {
            object: quickPick,
            method: "processIfValueIsStringType",
            throws: "test error message",
          },
          {
            object: utils,
            method: "isValueStringType",
            returns: true,
          },
        ],
        sandbox
      );
    },
    handleDidAccept1: () => {
      return stubMultiple(
        [
          { object: quickPick, method: "submit" },
          {
            object: quickPick.quickPickControl,
            method: "selectedItems",
            returns: [mock.qpItem],
            isNotMethod: true,
          },
        ],
        sandbox
      );
    },
    handleDidHide1: () => {
      return stubMultiple([{ object: quickPick, method: "clearText" }]);
    },
    handleDidChangeValue1: () => {
      return stubMultiple([
        {
          object: quickPick,
          method: "items",
          returns: mock.qpItems,
          isNotMethod: true,
        },
      ]);
    },
    handleWillGoLowerTreeLevel1: () => {
      return stubMultiple(
        [
          {
            object: dataService,
            method: "rememberHigherLevelQpData",
          },
          {
            object: quickPick.quickPickControl,
            method: "items",
            returns: mock.qpItems,
            isNotMethod: true,
          },
        ],
        sandbox
      );
    },
  };
};
