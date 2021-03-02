import { assert, expect, use } from "chai";
import * as sinon from "sinon";
import DataDownloader from "../../dataDownloader";
import { appConfig } from "../../appConfig";
import Item from "../../interface/item";
import * as mock from "../mock/dataDownloader.mock";
import Config from "src/config";
import { getConfigStub } from "../util/mockFactory";
import { getTestSetups } from "../testSetup/dataDownloader.testSetup";

const chaiAsPromised = require("chai-as-promised");
use(chaiAsPromised);

describe("DataDownloader", () => {
  let configStub: Config = getConfigStub();
  let dataDownloader: DataDownloader = new DataDownloader(configStub);
  let setups = getTestSetups(dataDownloader);

  beforeEach(() => {
    configStub = getConfigStub();
    dataDownloader = new DataDownloader(configStub);
    setups = getTestSetups(dataDownloader);
    setups.beforeEach();
  });

  afterEach(() => {
    setups.afterEach();
  });

  describe("downloadTreeData", () => {
    it("1: should return root directories items", async () => {
      setups.downloadTreeData1();

      const actual = await dataDownloader.downloadTreeData();
      const expected: Item[] = mock.downloadTreeDataDirectoriesOutputItems;
      assert.deepEqual(actual, expected);
    });

    it("2: should return element items", async () => {
      const expected: Item[] = setups.downloadTreeData2();
      const actual = await dataDownloader.downloadTreeData(
        mock.downloadTreeDataElementsItem
      );

      assert.deepEqual(actual, expected);
    });

    it("3: should return directories items", async () => {
      const expected: Item[] = setups.downloadTreeData3();
      const actual = await dataDownloader.downloadTreeData(
        mock.downloadTreeDataDirectoriesItem
      );

      assert.deepEqual(actual, expected);
    });

    it("4: should reject once api response with inappropriate status code", async () => {
      setups.downloadTreeData4();
      await expect(dataDownloader.downloadTreeData()).to.be.rejectedWith(
        "No Content"
      );
    });

    it("5: should request Authorization header has empty value if github personal token not passed", async () => {
      const fetchSpy = setups.downloadTreeData5();
      await dataDownloader.downloadTreeData();

      const actual = fetchSpy.calledWith(appConfig.rootUrl, {
        headers: {
          Authorization: "",
          "Content-type": "application/json",
        },
      });

      assert.equal(actual, true);
      sinon.restore();
    });

    it("6: should request Authorization header has value of github personal token once passed", async () => {
      const fetchSpy = setups.downloadTreeData6();
      await dataDownloader.downloadTreeData();

      const actual = fetchSpy.calledWith(appConfig.rootUrl, {
        headers: {
          Authorization: "token 123456789",
          "Content-type": "application/json",
        },
      });

      assert.equal(actual, true);
      sinon.restore();
    });
  });

  describe("downloadFlatData", () => {
    it("1: should return array with one item", async () => {
      const expected: Item[] = setups.downloadFlatData1();
      const actual = await dataDownloader
        .downloadFlatData()
        .catch((err) => console.log(err));

      assert.deepEqual(actual, expected);
    });

    it("2: should reject once api response with inappropriate status code", async () => {
      setups.downloadFlatData2();
      await expect(dataDownloader.downloadFlatData()).to.be.rejectedWith(
        "No Content"
      );
    });

    it("3: should reject once api returns error", async () => {
      setups.downloadFlatData3();
      await expect(dataDownloader.downloadFlatData()).to.be.rejectedWith(
        "test error message"
      );
    });
  });
});
