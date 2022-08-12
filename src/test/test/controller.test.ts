import { assert } from "chai";
import { controller } from "../../controller";
import { getTestSetups } from "../testSetup/controller.testSetup";

type SetupsType = ReturnType<typeof getTestSetups>;

describe("controller", () => {
  let setups: SetupsType;

  before(() => {
    setups = getTestSetups();
  });
  afterEach(() => setups.afterEach());

  describe("browse", () => {
    it("1: should load data and show quickPick", async () => {
      const [showStub, loadQuickPickDataStub] = setups.browse1();

      await controller.browse();
      assert.equal(showStub.calledOnce, true);
      assert.equal(loadQuickPickDataStub.calledOnce, true);
    });
  });

  describe("clearCache", () => {
    it("1: should invoke cache clearing function on cache object", async () => {
      const [clearCacheStub] = setups.clearCache1();

      await controller.clear();
      assert.equal(clearCacheStub.calledOnce, true);
    });
  });
});
