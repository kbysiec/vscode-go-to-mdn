import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import { appConfig } from "../../appConfig";
import * as dataService from "../../dataService";
import * as QuickPick from "../../quickPick";
import * as utils from "../../utils";
import * as mock from "../mock/quickPick.mock";
import { stubMultiple } from "../util/stubHelpers";

type QuickPick = typeof QuickPick;

const getComponent = (sandbox: sinon.SinonSandbox) => {
  const openStub = sandbox.stub().returns(Promise.resolve());
  const proxiedModule: QuickPick = proxyquire("../../quickPick", {
    open: openStub,
  });
  const { createQuickPick } = proxiedModule;
  const quickPick = createQuickPick();
  sandbox.restore();

  return {
    quickPick,
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
        ],
        sandbox
      );
    },
    registerEventListeners2: () => {
      return stubMultiple(
        [{ object: quickPick.quickPickControl, method: "onDidChangeValue" }],
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
            object: dataService,
            method: "getQuickPickData",
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
              object: utils,
              method: "isValueStringType",
              returns: false,
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
            object: utils,
            method: "isValueStringType",
            returns: false,
          },
        ],
        sandbox
      );
    },
    submit4: () => {
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
