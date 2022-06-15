import { Response } from "node-fetch";
import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import { appConfig } from "../../appConfig";
import * as config from "../../config";
import * as dataDownloaderModule from "../../dataDownloader";
import ItemType from "../../enum/itemType";
import Item from "../../interface/item";
import * as parser from "../../parser";
import * as mock from "../mock/dataDownloader.mock";
import { stubMultiple } from "../util/stubHelpers";

const fetchMock = require("fetch-mock").sandbox();

type DataDownloader = typeof dataDownloaderModule;

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
    downloadTreeData1: () => {
      stubMultiple(
        [
          {
            object: parser,
            method: "parseRootDirectories",
            returns: mock.downloadTreeDataDirectoriesOutputItems,
          },
          {
            object: config,
            method: "getGithubPersonalAccessToken",
          },
        ],
        sandbox
      );
      const fetchStub = fetchMock.get(
        appConfig.rootUrl,
        new Response(mock.downloadTreeDataRootDirectoriesContent, {
          status: 200,
        })
      );
      return getComponent(sandbox, fetchStub);
    },
    downloadTreeData2: () => {
      const expected: Item[] = [
        {
          name: "Accept Alert - reference",
          url: "https://developer.mozilla.org/docs/Web/WebDriver/Commands/AcceptAlert",
          type: ItemType.File,
          parent: mock.downloadTreeDataElementsItem,
          rootParent: undefined,
          breadcrumbs: [
            "webdriver",
            "commands",
            "Accept Alert",
            "Accept Alert",
          ],
        },
        {
          name: "wildcard",
          url: "",
          type: ItemType.File,
          parent: mock.downloadTreeDataElementsItem,
          rootParent: undefined,
          breadcrumbs: ["webdriver", "commands", "Accept Alert", "wildcard"],
        },
      ];

      stubMultiple(
        [
          {
            object: parser,
            method: "parseElements",
            returns: expected,
          },
          {
            object: config,
            method: "getGithubPersonalAccessToken",
          },
        ],
        sandbox
      );

      const fetchStub = fetchMock.get(
        "https://api.github.com/repos/mdn/browser-compat-data/contents/webdriver/commands/AcceptAlert.json?ref=main",
        new Response(mock.downloadTreeDataElementsContent, { status: 200 })
      );

      return {
        dataDownloader: getComponent(sandbox, fetchStub),
        expected,
      };
    },
    downloadTreeData3: () => {
      const expected: Item[] = [
        {
          name: "Abort Controller",
          url: "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortController.json?ref=main",
          type: ItemType.Directory,
          parent: mock.downloadTreeDataDirectoriesItem,
          rootParent: mock.downloadTreeDataDirectoriesItem,
          breadcrumbs: ["api", "Abort Controller"],
        },
        {
          name: "Abort Payment Event",
          url: "https://api.github.com/repos/mdn/browser-compat-data/contents/api/AbortPaymentEvent.json?ref=main",
          type: ItemType.Directory,
          parent: mock.downloadTreeDataDirectoriesItem,
          rootParent: mock.downloadTreeDataDirectoriesItem,
          breadcrumbs: ["api", "Abort Payment Event"],
        },
      ];

      stubMultiple(
        [
          {
            object: parser,
            method: "parseDirectories",
            returns: expected,
          },
          {
            object: config,
            method: "getGithubPersonalAccessToken",
          },
        ],
        sandbox
      );

      const fetchStub = fetchMock.get(
        "https://api.github.com/repos/mdn/browser-compat-data/contents/api?ref=main",
        new Response(mock.downloadTreeDataDirectoriesContent, { status: 200 })
      );

      return {
        dataDownloader: getComponent(sandbox, fetchStub),
        expected,
      };
    },
    downloadTreeData4: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "getGithubPersonalAccessToken",
          },
        ],
        sandbox
      );

      const fetchStub = fetchMock.get(
        appConfig.rootUrl,
        new Response("", { status: 204 })
      );

      return getComponent(sandbox, fetchStub);
    },
    downloadTreeData5: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "getGithubPersonalAccessToken",
          },
        ],
        sandbox
      );

      const fetchStub = fetchMock.get(
        appConfig.rootUrl,
        new Response(mock.downloadTreeDataRootDirectoriesContent, {
          status: 200,
        })
      );

      return { dataDownloader: getComponent(sandbox, fetchStub), fetchStub };
    },
    downloadTreeData6: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "getGithubPersonalAccessToken",
            returns: "123456789",
          },
        ],
        sandbox
      );

      const fetchStub = fetchMock.get(
        appConfig.rootUrl,
        new Response(mock.downloadTreeDataRootDirectoriesContent, {
          status: 200,
        })
      );

      return { dataDownloader: getComponent(sandbox, fetchStub), fetchStub };
    },
    downloadFlatData1: () => {
      const expected: Item[] = [
        {
          name: "compact",
          url: "https://developer.mozilla.org/docs/Web/API/HTMLUListElement/compact",
          parent: undefined,
          rootParent: undefined,
          type: ItemType.File,
          breadcrumbs: ["api", "HTMLU List Element", "compact"],
        },
      ];

      stubMultiple(
        [
          {
            object: parser,
            method: "parseFlatElements",
            returns: expected,
          },
          {
            object: config,
            method: "getGithubPersonalAccessToken",
          },
        ],
        sandbox
      );

      const fetchStub = fetchMock.get(
        appConfig.allFilesUrl,
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
    downloadFlatData2: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "getGithubPersonalAccessToken",
          },
        ],
        sandbox
      );

      const fetchStub = fetchMock.get(
        appConfig.allFilesUrl,
        new Response("", { status: 204 })
      );

      return getComponent(sandbox, fetchStub);
    },
    downloadFlatData3: () => {
      stubMultiple(
        [
          {
            object: config,
            method: "getGithubPersonalAccessToken",
          },
        ],
        sandbox
      );

      const fetchStub = fetchMock.get(appConfig.allFilesUrl, {
        throws: new Error("test error message"),
      });

      return getComponent(sandbox, fetchStub);
    },
  };
};
