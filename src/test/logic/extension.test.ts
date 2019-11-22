import * as vscode from "vscode";
import { assert, expect } from "chai";
import * as sinon from "sinon";
import * as extension from "../../extension";
const ExtensionController = require("../../extensionController");

const proxyquire = require("proxyquire");

describe("extension", function() {
  let context: vscode.ExtensionContext;

  before(function() {
    context = {
      subscriptions: [],
      workspaceState: {
        get: () => {},
        update: () => Promise.resolve()
      },
      globalState: {
        get: () => {},
        update: () => Promise.resolve()
      },
      extensionPath: "",
      storagePath: "",
      globalStoragePath: "",
      logPath: "",
      asAbsolutePath: (relativePath: string) => relativePath
    };
  });

  afterEach(function() {
    sinon.restore();
  });

  describe("activate", function() {
    it("should function exist", function() {
      const actual = typeof extension.activate;
      const expected = "function";
      assert.equal(actual, expected);
    });

    it("should register two commands", async function() {
      const stub = sinon.stub(vscode.commands, "registerCommand");
      // const spy = sinon.spy(stub);
      const context: vscode.ExtensionContext = {
        subscriptions: [],
        workspaceState: {
          get: () => {},
          update: () => Promise.resolve()
        },
        globalState: {
          get: () => {},
          update: () => Promise.resolve()
        },
        extensionPath: "",
        storagePath: "",
        globalStoragePath: "",
        logPath: "",
        asAbsolutePath: (relativePath: string) => relativePath
      };

      await extension.activate(context);

      const actual = stub.calledTwice;
      const expected = true;
      assert.equal(actual, expected);
    });
  });

  describe("deactivate", function() {
    it("should function exist", function() {
      const spy = sinon.spy(console, "log");
      const actual = typeof extension.deactivate;
      const expected = "function";

      extension.deactivate();

      assert.equal(spy.calledOnce, true);
      assert.equal(actual, expected);
    });
  });

  describe("browse", function() {
    it("should function exist", function() {
      const actual = typeof extension.browse;
      const expected = "function";

      assert.equal(actual, expected);
    });

    it("should function browse be fulfilled", async function() {
      const spy = sinon
        .stub(ExtensionController.default.prototype, "showQuickPick")
        .returns(Promise.resolve());

      const proxied = proxyquire("../../extension", {
        "./ExtensionController": ExtensionController
      });

      proxied.browse(context);
      const actual = spy.calledOnce;
      const expected = true;

      assert.equal(actual, expected);
    });

    it("should function clearCache be called", function() {
      const spy = sinon.stub(
        ExtensionController.default.prototype,
        "clearCache"
      );
      const proxied = proxyquire("../../extension", {
        "./ExtensionController": ExtensionController
      });

      proxied.clearCache(context);
      const actual = spy.calledOnce;
      const expected = true;

      assert.equal(actual, expected);
    });
  });
});
