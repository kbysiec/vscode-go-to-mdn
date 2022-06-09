import { assert } from "chai";
import * as vscode from "vscode";
import * as extension from "../../extension";
import { createExtensionController } from "../../extensionController";
import { getTestSetups } from "../testSetup/extension.testSetup";

type ExtensionController = ReturnType<typeof createExtensionController>;
type SetupsType = ReturnType<typeof getTestSetups>;

describe("extension", () => {
  let setups: SetupsType;
  let context: vscode.ExtensionContext;
  let extensionController: ExtensionController;

  before(() => {
    setups = getTestSetups();
    ({ context, extensionController } = setups.before());
  });
  afterEach(() => setups.afterEach());

  describe("activate", () => {
    it("1: should register two commands", async () => {
      const [registerCommandStub] = setups.activate1();
      await extension.activate(context);

      assert.equal(registerCommandStub.calledTwice, true);
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
