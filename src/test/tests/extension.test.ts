import * as vscode from "vscode";
import { assert } from "chai";
import * as extension from "../../extension";
import { getExtensionContext } from "../util/mockFactory";
import { stubMultiple } from "../util/stubUtils";
import ExtensionController from "../../ExtensionController";
import { getTestSetups } from "../testSetups/extension.testSetup";

describe("extension", () => {
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

  describe("activate", () => {
    it("1: should register two commands", async () => {
      const [registerCommandStub] = setups.activate1();
      await extension.activate(context);

      assert.equal(registerCommandStub.calledTwice, true);
    });
  });

  describe("deactivate", () => {
    it("1: should function exist", () => {
      const [logStub] = setups.deactivate1();
      extension.deactivate();

      assert.equal(logStub.calledOnce, true);
      assert.equal(typeof extension.deactivate, "function");
    });
  });

  describe("browse", () => {
    it("1: should extensionController.browse method be invoked", () => {
      const [browseStub] = setups.browse1();
      extension.browse(extensionController);

      assert.equal(browseStub.calledOnce, true);
    });
  });

  describe("clearCache", () => {
    it("1: should extensionController.clearCache method be invoked", () => {
      const [clearCacheStub] = setups.clearCache1();
      extension.clearCache(extensionController);

      assert.equal(clearCacheStub.calledOnce, true);
    });
  });
});
