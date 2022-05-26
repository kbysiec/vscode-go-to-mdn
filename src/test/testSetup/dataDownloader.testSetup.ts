import { Response } from "node-fetch";
import * as sinon from "sinon";
import { appConfig } from "../../appConfig";
import * as config from "../../config";
import ItemType from "../../enum/itemType";
import Item from "../../interface/item";
import * as mock from "../mock/dataDownloader.mock";
import { stubMultiple } from "../util/stubHelpers";

const fetch = require("node-fetch");
const fetchMock = require("fetch-mock").sandbox();

export const getTestSetups = () => {
  return {
    beforeEach: () => {
      fetch.cache = {};
      fetch.cache.default = fetch.default;
    },
    afterEach: () => {
      fetchMock.restore();
      fetch.default = fetch.cache.default;
      delete fetch.cache;
    },
    downloadTreeData1: () => {
      const fetchStub = fetchMock.get(
        appConfig.rootUrl,
        new Response(mock.downloadTreeDataRootDirectoriesContent, {
          status: 200,
        })
      );
      fetch.default = fetchStub;
    },
    downloadTreeData2: () => {
      const fetchStub = fetchMock.get(
        "https://api.github.com/repos/mdn/browser-compat-data/contents/webdriver/commands/AcceptAlert.json?ref=main",
        new Response(mock.downloadTreeDataElementsContent, { status: 200 })
      );
      fetch.default = fetchStub;

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

      return expected;
    },
    downloadTreeData3: () => {
      const fetchStub = fetchMock.get(
        "https://api.github.com/repos/mdn/browser-compat-data/contents/api?ref=main",
        new Response(mock.downloadTreeDataDirectoriesContent, { status: 200 })
      );
      fetch.default = fetchStub;

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

      return expected;
    },
    downloadTreeData4: () => {
      const fetchStub = fetchMock.get(
        appConfig.rootUrl,
        new Response("", { status: 204 })
      );
      fetch.default = fetchStub;
    },
    downloadTreeData5: () => {
      stubMultiple([
        {
          object: config,
          method: "getGithubPersonalAccessToken",
          returns: undefined,
        },
      ]);

      const fetchStub = fetchMock.get(
        appConfig.rootUrl,
        new Response(mock.downloadTreeDataRootDirectoriesContent, {
          status: 200,
        })
      );
      fetch.default = fetchStub;
      const fetchSpy = sinon.spy(fetch, "default");

      return fetchSpy;
    },
    downloadTreeData6: () => {
      stubMultiple([
        {
          object: config,
          method: "getGithubPersonalAccessToken",
          returns: "123456789",
        },
      ]);

      const fetchStub = fetchMock.get(
        appConfig.rootUrl,
        new Response(mock.downloadTreeDataRootDirectoriesContent, {
          status: 200,
        })
      );
      fetch.default = fetchStub;
      const fetchSpy = sinon.spy(fetch, "default");

      return fetchSpy;
    },
    downloadFlatData1: () => {
      const fetchStub = fetchMock.get(
        appConfig.allFilesUrl,
        new Response(
          '{"items":[{"id":216685,"name":"compact","url":"https://developer.mozilla.org/docs/Web/API/HTMLUListElement/compact","parent":null,"rootParent":null,"type":2,"breadcrumbs":["api","HTMLU List Element","compact"],"timestamp":"2019-11-19T00:00:00"}]}',
          { status: 200 }
        )
      );
      fetch.default = fetchStub;

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

      return expected;
    },
    downloadFlatData2: () => {
      const fetchStub = fetchMock.get(
        appConfig.allFilesUrl,
        new Response("", { status: 204 })
      );
      fetch.default = fetchStub;
    },
    downloadFlatData3: () => {
      const fetchStub = fetchMock.get(appConfig.allFilesUrl, {
        throws: new Error("test error message"),
      });
      fetch.default = fetchStub;
    },
  };
};
