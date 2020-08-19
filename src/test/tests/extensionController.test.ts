import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import ExtensionController from "../../ExtensionController";
import { getExtensionContext } from "../util/mockFactory";
import { restoreStubbedMultiple, stubMultiple } from "../util/stubUtils";

describe("extensionController", () => {
  let context: vscode.ExtensionContext;
  let extensionController: ExtensionController;
  let extensionControllerAny: any;

  beforeEach(() => {
    context = getExtensionContext();
    extensionController = new ExtensionController(context);
    extensionControllerAny = extensionController as any;
  });

  describe("browse", () => {
    it("should load data and show quickPick", async () => {
      const [showStub, loadQuickPickDataStub] = stubMultiple([
        { object: extensionControllerAny.quickPick, method: "show" },
        {
          object: extensionControllerAny.quickPick,
          method: "loadQuickPickData",
        },
      ]);

      await extensionControllerAny.browse();
      assert.equal(showStub.calledOnce, true);
      assert.equal(loadQuickPickDataStub.calledOnce, true);
    });
  });

  describe("clearCache", () => {
    it("should invoke cache clearing function on cache object", async () => {
      const [clearCacheStub] = stubMultiple([
        { object: extensionControllerAny.cache, method: "clearCache" },
      ]);

      await extensionControllerAny.clearCache();
      assert.equal(clearCacheStub.calledOnce, true);
    });
  });
});
