import { assert } from "chai";
import * as sinon from "sinon";
import * as vscode from "vscode";
import * as config from "../../config";
import { getTestSetups } from "../testSetup/config.testSetup";

describe("Config", () => {
  let configuration: { [key: string]: any };
  let setups = getTestSetups();

  beforeEach(() => {
    ({ configuration } = setups.beforeEach());
    setups = getTestSetups();
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
