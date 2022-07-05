import { Response } from "node-fetch";
import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import { appConfig } from "../../appConfig";
import * as DataDownloader from "../../dataDownloader";
import * as parser from "../../parser";
import { stubMultiple } from "../util/stubHelpers";

const fetchMock = require("fetch-mock").sandbox();

type DataDownloader = typeof DataDownloader;

const getComponent = (sandbox: sinon.SinonSandbox, fetchStub?: any) => {
  const proxiedModule: DataDownloader = proxyquire("../../dataDownloader", {
    "node-fetch": fetchStub || sandbox.stub(),
  });

  return proxiedModule;
};

export const getTestSetups = () => {
  const sandbox = sinon.createSandbox();
  const dataDownloader = getComponent(sandbox);

  return {
    before: () => {
      return dataDownloader;
    },
    afterEach: () => {
      fetchMock.restore();
      sandbox.restore();
    },
    downloadData1: () => {
      const stubs = stubMultiple(
        [
          {
            object: parser,
            method: "parseData",
          },
        ],
        sandbox
      );

      const fetchStub = fetchMock.get(
        appConfig.inputDataUrl,
        new Response(
          `{"__meta": "version 1.2.3","browsers": {"__compat": {"mdn_url": "https://developer.mozilla.org/docs/api/test-label/sub-label-3"}},"prop1": {"__compat": {"mdn_url": "https://developer.mozilla.org/docs/api/test-label/sub-label"}},"prop2": {"__compat": {"mdn_url": "https://developer.mozilla.org/docs/api/test-label/sub-label-2"}}}`,
          { status: 200 }
        )
      );

      return {
        dataDownloader: getComponent(sandbox, fetchStub),
        stubs,
      };
    },
    downloadData2: () => {
      const fetchStub = fetchMock.get(
        appConfig.inputDataUrl,
        new Response("", { status: 204 })
      );

      return getComponent(sandbox, fetchStub);
    },
    downloadData3: () => {
      const fetchStub = fetchMock.get(appConfig.inputDataUrl, {
        throws: new Error("test error message"),
      });

      return getComponent(sandbox, fetchStub);
    },
  };
};
