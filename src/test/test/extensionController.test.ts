import { assert } from "chai";
import { createExtensionController } from "../../extensionController";
import { getTestSetups } from "../testSetup/extensionController.testSetup";

type ExtensionController = ReturnType<typeof createExtensionController>;
type SetupsType = ReturnType<typeof getTestSetups>;

describe("extensionController", () => {
  let setups: SetupsType;
  let extensionController: ExtensionController;

  before(() => {
    setups = getTestSetups();
    extensionController = setups.before();
  });
  afterEach(() => setups.afterEach());

  describe("browse", () => {
    it("1: should load data and show quickPick", async () => {
      const [showStub, loadQuickPickDataStub] = setups.browse1();

      await extensionController.browse();
      assert.equal(showStub.calledOnce, true);
      assert.equal(loadQuickPickDataStub.calledOnce, true);
    });
  });

  describe("clearCache", () => {
    it("1: should invoke cache clearing function on cache object", async () => {
      const [clearCacheStub] = setups.clearCache1();

      await extensionController.clear();
      assert.equal(clearCacheStub.calledOnce, true);
    });
  });
});
