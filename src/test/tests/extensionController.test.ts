import * as vscode from "vscode";
import { assert } from "chai";
import * as sinon from "sinon";
import ExtensionController from "../../ExtensionController";
import { getExtensionContext } from "../util/mockFactory";

describe("extensionController", () => {
  let context: vscode.ExtensionContext;
  let extensionController: ExtensionController;
  let extensionControllerAny: any;

  before(() => {
    context = getExtensionContext();
    extensionController = new ExtensionController(context);
  });

  beforeEach(() => {
    extensionControllerAny = extensionController as any;
  });

  afterEach(() => {
    sinon.restore();
  });
  describe("browse", () => {
    it("should load data and show quickPick", async () => {
      const showStub = sinon.stub(extensionControllerAny.quickPick, "show");
      const loadQuickPickDataStub = sinon.stub(
        extensionControllerAny.quickPick,
        "loadQuickPickData"
      );

      await extensionControllerAny.browse();
      assert.equal(showStub.calledOnce, true);
      assert.equal(loadQuickPickDataStub.calledOnce, true);
    });
  });

  describe("clearCache", () => {
    it("should invoke cache clearing function on cache object", async () => {
      const stub = sinon.stub(extensionControllerAny.cache, "clearCache");

      await extensionControllerAny.clearCache();
      assert.equal(stub.calledOnce, true);
    });
  });
});
