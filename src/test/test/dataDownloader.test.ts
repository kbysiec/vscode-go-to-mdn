import { assert, expect, use } from "chai";
import { appConfig } from "../../appConfig";
import Item from "../../interface/item";
import * as mock from "../mock/dataDownloader.mock";
import { getTestSetups } from "../testSetup/dataDownloader.testSetup";

type SetupsType = ReturnType<typeof getTestSetups>;

const chaiAsPromised = require("chai-as-promised");
use(chaiAsPromised);

describe("DataDownloader", () => {
  let setups: SetupsType;

  before(() => {
    setups = getTestSetups();
    setups.before();
  });
  afterEach(() => setups.afterEach());

  describe("downloadTreeData", () => {
    it("1: should return root directories items", async () => {
      const dataDownloader = setups.downloadTreeData1();

      const actual = await dataDownloader.downloadTreeData();
      const expected: Item[] = mock.downloadTreeDataDirectoriesOutputItems;
      assert.deepEqual(actual, expected);
    });

    it("2: should return element items", async () => {
      const { dataDownloader, expected } = setups.downloadTreeData2();
      const actual = await dataDownloader.downloadTreeData(
        mock.downloadTreeDataElementsItem
      );

      assert.deepEqual(actual, expected);
    });

    it("3: should return directories items", async () => {
      const { dataDownloader, expected } = setups.downloadTreeData3();
      const actual = await dataDownloader.downloadTreeData(
        mock.downloadTreeDataDirectoriesItem
      );

      assert.deepEqual(actual, expected);
    });

    it("4: should reject once api response with inappropriate status code", async () => {
      const dataDownloader = setups.downloadTreeData4();
      await expect(dataDownloader.downloadTreeData()).to.be.rejectedWith(
        "No Content"
      );
    });

    it("5: should request Authorization header has empty value if github personal token not passed", async () => {
      const { dataDownloader, fetchStub } = setups.downloadTreeData5();
      await dataDownloader.downloadTreeData();

      const [actualUrl, actualHeaders] = fetchStub.calls()[0];
      const [expectedUrl, expectedHeaders] = [
        appConfig.rootUrl,
        {
          headers: {
            Authorization: "",
            "Content-type": "application/json",
          },
        },
      ];

      assert.equal(actualUrl, expectedUrl);
      assert.deepEqual(actualHeaders, expectedHeaders);
    });

    it("6: should request Authorization header has value of github personal token once passed", async () => {
      const { dataDownloader, fetchStub } = setups.downloadTreeData6();
      await dataDownloader.downloadTreeData();

      const [actualUrl, actualHeaders] = fetchStub.calls()[0];
      const [expectedUrl, expectedHeaders] = [
        appConfig.rootUrl,
        {
          headers: {
            Authorization: "token 123456789",
            "Content-type": "application/json",
          },
        },
      ];

      assert.equal(actualUrl, expectedUrl);
      assert.deepEqual(actualHeaders, expectedHeaders);
    });
  });

  describe("downloadFlatData", () => {
    it("1: should return array with one item", async () => {
      const { dataDownloader, expected } = setups.downloadFlatData1();
      const actual = await dataDownloader
        .downloadFlatData()
        .catch((err) => console.log(err));

      assert.deepEqual(actual, expected);
    });

    it("2: should reject once api response with inappropriate status code", async () => {
      const dataDownloader = setups.downloadFlatData2();
      await expect(dataDownloader.downloadFlatData()).to.be.rejectedWith(
        "No Content"
      );
    });

    it("3: should reject once api returns error", async () => {
      const dataDownloader = setups.downloadFlatData3();
      await expect(dataDownloader.downloadFlatData()).to.be.rejectedWith(
        "test error message"
      );
    });
  });
});
