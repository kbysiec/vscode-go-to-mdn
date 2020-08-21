import * as vscode from "vscode";
import { assert } from "chai";
import * as extension from "../../extension";
import { getExtensionContext } from "../util/mockFactory";
import { stubMultiple } from "../util/stubUtils";
import ExtensionController from "../../ExtensionController";

describe("extension", () => {
  let context: vscode.ExtensionContext;
  let extensionController: ExtensionController;
  let extensionControllerAny: any;

  beforeEach(() => {
    context = getExtensionContext();
    extensionController = new ExtensionController(context);
    extensionControllerAny = extensionController as any;
  });

  describe("activate", () => {
    it("should register two commands", async () => {
      const [registerCommandStub] = stubMultiple([
        { object: vscode.commands, method: "registerCommand" },
      ]);

      await extension.activate(context);

      assert.equal(registerCommandStub.calledTwice, true);
    });
  });

  describe("deactivate", () => {
    it("should function exist", () => {
      const [logStub] = stubMultiple([{ object: console, method: "log" }]);

      extension.deactivate();

      assert.equal(logStub.calledOnce, true);
      assert.equal(typeof extension.deactivate, "function");
    });
  });

  describe("browse", () => {
    it("should extensionController.browse method be invoked", () => {
      const [browseStub] = stubMultiple([
        {
          object: extensionController,
          method: "browse",
        },
      ]);

      extension.browse(extensionController);

      assert.equal(browseStub.calledOnce, true);
    });
  });

  describe("clearCache", () => {
    it("should extensionController.clearCache method be invoked", () => {
      const [clearCacheStub] = stubMultiple([
        {
          object: extensionController,
          method: "clearCache",
        },
      ]);

      extension.clearCache(extensionController);

      assert.equal(clearCacheStub.calledOnce, true);
    });
  });
});
