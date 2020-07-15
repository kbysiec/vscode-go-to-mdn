import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import Config from "../../config";
import { getConfiguration } from "../util/mockFactory";

describe("Config", () => {
  let config: Config;
  let configAny: any;
  let getConfigurationStub: sinon.SinonStub;
  let configuration: { [key: string]: any };

  before(() => {
    configuration = getConfiguration();
    config = new Config();
    configAny = config as any;
  });

  beforeEach(() => {
    getConfigurationStub = sinon
      .stub(vscode.workspace, "getConfiguration")
      .returns({
        get: (section: string) =>
          section.split(".").reduce((cfg, key) => cfg[key], configuration),
        has: () => true,
        inspect: () => undefined,
        update: () => Promise.resolve(),
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getGithubPersonalAccessToken", () => {
    it("should return string from configuration", () => {
      const section = "goToMDN";
      const key = "githubPersonalAccessToken";

      assert.equal(
        config.getGithubPersonalAccessToken(),
        configuration[section][key]
      );
    });
  });

  describe("shouldDisplayFlatList", () => {
    it("should return boolean from configuration", () => {
      const section = "goToMDN";
      const key = "shouldDisplayFlatList";

      assert.equal(config.shouldDisplayFlatList(), configuration[section][key]);
    });
  });

  describe("get", () => {
    it("should return boolean for shouldDisplayFlatList", () => {
      const section = "goToMDN";
      const key = "shouldDisplayFlatList";

      assert.equal(configAny.get(key, false), configuration[section][key]);
    });
  });

  describe("getConfiguration", () => {
    it("should return boolean for shouldDisplayFlatList", () => {
      const section = "goToMDN";
      const key = "shouldDisplayFlatList";

      assert.equal(
        configAny.getConfiguration(`${section}.${key}`, []),
        configuration[section][key]
      );
    });
  });
});
