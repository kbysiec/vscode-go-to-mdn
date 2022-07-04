import { assert } from "chai";
import * as dataService from "../../dataService";
import * as mock from "../mocks";
import { getTestSetups } from "../testSetup/dataService.testSetup";

type SetupsType = ReturnType<typeof getTestSetups>;

describe("DataService", () => {
  let setups: SetupsType;

  before(() => {
    setups = getTestSetups();
  });
  afterEach(() => setups.afterEach());

  describe("getQuickPickData", () => {
    it("1: should return quick pick data from cache", async () => {
      setups.getQuickPickData1();
      assert.deepEqual(await dataService.getQuickPickData(), mock.qpItems);
    });

    it("2: should downloadData be invoked if cache is empty", async () => {
      const [downloadDataStub] = setups.getQuickPickData2();
      await dataService.getQuickPickData();
      assert.equal(downloadDataStub.calledOnce, true);
    });
  });
});
