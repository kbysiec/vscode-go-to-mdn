import { Response } from "node-fetch";
import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import { appConfig } from "../../appConfig";
import * as DataDownloader from "../../dataDownloader";
import Item from "../../interface/item";
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
      const expected: Item[] = [
        {
          name: "compact",
          url: "https://developer.mozilla.org/docs/Web/API/HTMLUListElement/compact",
          breadcrumbs: ["api", "HTMLU List Element", "compact"],
        },
      ];

      stubMultiple(
        [
          {
            object: parser,
            method: "parseData",
            returns: expected,
          },
        ],
        sandbox
      );

      const fetchStub = fetchMock.get(
        appConfig.inputDataUrl,
        new Response(
          '{"items":[{"id":216685,"name":"compact","url":"https://developer.mozilla.org/docs/Web/API/HTMLUListElement/compact","parent":null,"rootParent":null,"type":2,"breadcrumbs":["api","HTMLU List Element","compact"],"timestamp":"2019-11-19T00:00:00"}]}',
          { status: 200 }
        )
      );

      return {
        dataDownloader: getComponent(sandbox, fetchStub),
        expected,
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
