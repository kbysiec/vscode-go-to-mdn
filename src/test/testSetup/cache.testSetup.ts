import * as sinon from "sinon";
import { appConfig } from "../../appConfig";
import * as mock from "../mocks";
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
            method: "cacheKey",
            returns: "data",
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
    updateDataInCache1: () => {
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
    getDataFromCache1: () => {
      stubMultiple(
        [
          {
            object: context.globalState,
            method: "get",
            returns: mock.outputData,
          },
        ],
        sandbox
      );
    },
    getDataFromCache2: () => {
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
