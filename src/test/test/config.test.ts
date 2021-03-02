import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import Config from "../../config";
import { getTestSetups } from "../testSetup/config.testSetup";

describe("Config", () => {
  let configuration: { [key: string]: any };
  let getConfigurationStub: sinon.SinonStub;
  let config: Config = new Config();
  let setups = getTestSetups(config);

  beforeEach(() => {
    ({
      configuration,
      stubs: [getConfigurationStub],
    } = setups.beforeEach());
    config = new Config();
    setups = getTestSetups(config);
  });

  afterEach(() => {
    (vscode.workspace.getConfiguration as sinon.SinonStub).restore();
  });

  describe("getGithubPersonalAccessToken", () => {
    it("1: should return string from configuration", () => {
      const section = "goToMDN";
      const key = "githubPersonalAccessToken";

      assert.equal(
        config.getGithubPersonalAccessToken(),
        configuration[section][key]
      );
    });
  });

  describe("shouldDisplayFlatList", () => {
    it("1: should return boolean from configuration", () => {
      const section = "goToMDN";
      const key = "shouldDisplayFlatList";

      assert.equal(config.shouldDisplayFlatList(), configuration[section][key]);
    });
  });
});
