import * as vscode from "vscode";
import { assert } from "chai";
import ExtensionController from "../../ExtensionController";
import { getExtensionContext } from "../util/mockFactory";
import { getTestSetups } from "../testSetups/extensionController.testSetup";

describe("extensionController", () => {
  let context: vscode.ExtensionContext = getExtensionContext();
  let extensionController: ExtensionController = new ExtensionController(
    context
  );
  let setups = getTestSetups(extensionController);

  beforeEach(() => {
    context = getExtensionContext();
    extensionController = new ExtensionController(context);
    setups = getTestSetups(extensionController);
  });

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

      await extensionController.clearCache();
      assert.equal(clearCacheStub.calledOnce, true);
    });
  });
});
