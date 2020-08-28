import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import Config from "../../config";
import { getConfiguration } from "../util/mockFactory";

describe("Config", () => {
  let config: Config;
  let configAny: any;
  let configuration: { [key: string]: any };

  before(() => {
    configuration = getConfiguration();
    config = new Config();
    configAny = config as any;
  });

  beforeEach(() => {
    sinon.stub(vscode.workspace, "getConfiguration").returns({
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
});
