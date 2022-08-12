import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import * as vscode from "vscode";
import { appConfig } from "../../appConfig";
import * as dataService from "../../dataService";
import * as utils from "../../utils";
import * as mock from "../mocks";
import { stubMultiple } from "../util/stubHelpers";

const getComponent = (sandbox: sinon.SinonSandbox) => {
  const openStub = sandbox.stub().returns(Promise.resolve());
  const proxiedModule = proxyquire("../../quickPick", {
    open: openStub,
  });
  const { quickPick } = proxiedModule;
  quickPick.init();
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
      const quickPickInner =
        vscode.window.createQuickPick<vscode.QuickPickItem>();
      return stubMultiple(
        [
          {
            object: quickPickInner,
            method: "onDidHide",
          },
          {
            object: quickPickInner,
            method: "onDidAccept",
          },
          {
            object: quickPick,
            method: "getControl",
            returns: quickPickInner,
          },
        ],
        sandbox
      );
    },
    registerEventListeners2: () => {
      const quickPickInner =
        vscode.window.createQuickPick<vscode.QuickPickItem>();

      return stubMultiple(
        [
          {
            object: quickPickInner,
            method: "onDidChangeValue",
          },
          {
            object: quickPick,
            method: "getControl",
            returns: quickPickInner,
          },
        ],
        sandbox
      );
    },
    show1: () => {
      const quickPickInner =
        vscode.window.createQuickPick<vscode.QuickPickItem>();

      return stubMultiple(
        [
          {
            object: quickPickInner,
            method: "show",
          },
          {
            object: quickPick,
            method: "getControl",
            returns: quickPickInner,
          },
        ],
        sandbox
      );
    },
    loadQuickPickData1: () => {
      stubMultiple(
        [
          {
            object: dataService,
            method: "getQuickPickData",
            returns: Promise.resolve(mock.outputData),
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
            {
              object: dataService,
              method: "getQuickPickData",
              returns: Promise.resolve(mock.outputData),
            },
          ],
          sandbox
        ),
      ];
    },
    submit2: () => {
      const quickPickInner =
        vscode.window.createQuickPick<vscode.QuickPickItem>();

      return [
        openStub,
        ...stubMultiple(
          [
            {
              object: quickPickInner,
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
              object: quickPick,
              method: "getControl",
              returns: quickPickInner,
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
          {
            object: dataService,
            method: "getQuickPickData",
            returns: Promise.resolve(mock.outputData),
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
      const quickPickInner =
        vscode.window.createQuickPick<vscode.QuickPickItem>();

      return stubMultiple(
        [
          {
            object: quickPick,
            method: "submit",
          },
          {
            object: quickPickInner,
            method: "selectedItems",
            returns: [mock.qpItem],
            isNotMethod: true,
          },
          {
            object: quickPick,
            method: "getControl",
            returns: quickPickInner,
          },
        ],
        sandbox
      );
    },
    handleDidHide1: () => {
      return stubMultiple(
        [{ object: quickPick, method: "clearText" }],
        sandbox
      );
    },
    handleDidChangeValue1: () => {
      return stubMultiple(
        [
          {
            object: quickPick,
            method: "getItems",
            returns: mock.qpItems,
          },
        ],
        sandbox
      );
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
