import * as sinon from "sinon";
import * as cache from "../../cache";
import * as dataConverter from "../../dataConverter";
import * as dataDownloader from "../../dataDownloader";
import * as utils from "../../utils";
import * as mock from "../mock/mocks";
import { stubMultiple } from "../util/stubHelpers";

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();

  return {
    afterEach: () => {
      sandbox.restore();
    },
    getQuickPickData1: () => {
      stubMultiple(
        [
          {
            object: cache,
            method: "getDataFromCache",
            returns: mock.outputData,
          },
          {
            object: cache,
            method: "updateDataInCache",
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
      return stubMultiple(
        [
          {
            object: dataDownloader,
            method: "downloadData",
          },
          {
            object: cache,
            method: "getDataFromCache",
            returns: undefined,
          },

          {
            object: dataConverter,
            method: "prepareQpData",
            returns: mock.qpItems,
          },
          {
            object: cache,
            method: "updateDataInCache",
          },

          {
            object: utils,
            method: "removeDataWithEmptyUrl",
          },
        ],
        sandbox
      );
    },
  };
};
