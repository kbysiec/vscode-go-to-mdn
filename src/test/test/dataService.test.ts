import { assert } from "chai";
import Cache from "../../cache";
import Config from "../../config";
import DataService from "../../dataService";
import Utils from "../../utils";
import * as mock from "../mock/dataService.mock";
import { getTestSetups } from "../testSetup/dataService.testSetup";
import { getCacheStub, getConfigStub, getUtilsStub } from "../util/mockFactory";

describe("DataService", () => {
  let cacheStub: Cache = getCacheStub();
  let utilsStub: Utils = getUtilsStub();
  let configStub: Config = getConfigStub();
  let dataService: DataService = new DataService(
    cacheStub,
    utilsStub,
    configStub
  );
  let setups = getTestSetups(dataService);

  beforeEach(() => {
    cacheStub = getCacheStub();
    utilsStub = getUtilsStub();
    configStub = getConfigStub();
    dataService = new DataService(cacheStub, utilsStub, configStub);
    setups = getTestSetups(dataService);
  });

  describe("getFlatQuickPickData", () => {
    it("1: should return flat quick pick data from cache", async () => {
      setups.getFlatQuickPickData1();
      assert.deepEqual(await dataService.getFlatQuickPickData(), mock.qpItems);
    });

    it("2: should return flat quick pick data if in cache is empty array", async () => {
      setups.getFlatQuickPickData2();
      assert.deepEqual(await dataService.getFlatQuickPickData(), mock.qpItems);
    });

    it("3: should do nothing in fetching flat quick pick data if shouldDisplayFlatList returns false", async () => {
      const [cacheFlatFilesWithProgressTaskStub] =
        setups.getFlatQuickPickData3();

      await dataService.getFlatQuickPickData();
      assert.equal(cacheFlatFilesWithProgressTaskStub.calledOnce, false);
    });
  });

  describe("getQuickPickRootData", () => {
    it("1: should return tree root data", async () => {
      setups.getQuickPickRootData1();
      assert.deepEqual(await dataService.getQuickPickRootData(), mock.qpItems);
    });
  });

  describe("getQuickPickData", () => {
    it("1: should return higher level data", async () => {
      setups.getQuickPickData1();
      assert.deepEqual(
        await dataService.getQuickPickData(mock.backwardNavigationQpItem),
        mock.qpItems
      );
    });

    it("2: should return lower level data", async () => {
      setups.getQuickPickData2();
      assert.deepEqual(
        await dataService.getQuickPickData(mock.qpItem),
        mock.qpItems
      );
    });

    it("3: should return lower level data without empty urls", async () => {
      setups.getQuickPickData3();
      assert.deepEqual(
        await dataService.getQuickPickData(mock.qpItem),
        mock.qpItems
      );
    });

    it("4: should return quick pick tree data if data is not in cache and parent item is provided", async () => {
      setups.getQuickPickData4();
      assert.deepEqual(
        await dataService.getQuickPickData(mock.qpItem),
        mock.qpItems
      );
    });

    it("5: should return quick pick tree data if data is in cache", async () => {
      setups.getQuickPickData5();
      assert.deepEqual(
        await dataService.getQuickPickData(mock.qpItem),
        mock.qpItems
      );
    });
  });

  describe("rememberHigherLevelQpData", () => {
    it("1: should remember higher level data", () => {
      setups.rememberHigherLevelQpData1();
      dataService.rememberHigherLevelQpData(mock.qpItems);

      assert.deepEqual((dataService as any).higherLevelData, [mock.qpItems]);
    });
  });

  describe("isHigherLevelDataEmpty", () => {
    it("1: should check if higherLevelData array is empty", () => {
      setups.isHigherLevelDataEmpty1();
      assert.equal(dataService.isHigherLevelDataEmpty(), false);
    });
  });
});
