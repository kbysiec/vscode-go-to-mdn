import { assert } from "chai";
import * as config from "../../config";
import { getTestSetups } from "../testSetup/config.testSetup";

type SetupsType = ReturnType<typeof getTestSetups>;

describe("Config", () => {
  let setups: SetupsType;
  let configuration: { [key: string]: { [key: string]: string | boolean } };

  before(() => {
    setups = getTestSetups();
    ({ configuration } = setups.before());
  });
  afterEach(() => setups.afterEach());

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
