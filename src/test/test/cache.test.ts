import { assert } from "chai";
import * as vscode from "vscode";
import { appConfig } from "../../appConfig";
import * as cache from "../../cache";
import * as mock from "../mock/cache.mock";
import { getTestSetups } from "../testSetup/cache.testSetup";

type SetupsType = ReturnType<typeof getTestSetups>;

describe("Cache", () => {
  let context: vscode.ExtensionContext;
  let setups: SetupsType;

  before(() => {
    setups = getTestSetups();
    context = setups.before();
    cache.initCache(context);
  });
  afterEach(() => setups.afterEach());

  describe("updateDataInCache", () => {
    it("1: should update cache value", () => {
      const [updateStub] = setups.updateDataInCache1();
      cache.updateDataInCache(mock.outputData);

      assert.equal(
        updateStub.calledWith(appConfig.cacheKey, mock.outputData),
        true
      );
    });
  });

  describe("getDataFromCache", () => {
    it("1: should return value from cache", () => {
      setups.getDataFromCache1();
      assert.deepEqual(cache.getDataFromCache(), mock.outputData);
    });

    it("2: should return empty array from cache", () => {
      setups.getDataFromCache2();
      assert.deepEqual(cache.getDataFromCache(), mock.emptyOutputData);
    });
  });

  describe("clearCache", () => {
    it("1: should clear cache", () => {
      const [updateStub] = setups.clearCache1();
      cache.clearCache();
      assert.equal(updateStub.calledOnce, true);
    });
  });
});
