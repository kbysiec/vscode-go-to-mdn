import { assert, expect, use } from "chai";
import * as mock from "../mock/mocks";
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

  describe("downloadData", () => {
    it("1: should return array with one item", async () => {
      const {
        dataDownloader,
        stubs: [parseDataStub],
      } = setups.downloadData1();
      await dataDownloader.downloadData().catch((err) => console.log(err));

      assert.equal(parseDataStub.calledWith(mock.parserInput), true);
    });

    it("2: should reject once api response with inappropriate status code", async () => {
      const dataDownloader = setups.downloadData2();
      await expect(dataDownloader.downloadData()).to.be.rejectedWith(
        "No Content"
      );
    });

    it("3: should reject once api returns error", async () => {
      const dataDownloader = setups.downloadData3();
      await expect(dataDownloader.downloadData()).to.be.rejectedWith(
        "test error message"
      );
    });
  });
});
