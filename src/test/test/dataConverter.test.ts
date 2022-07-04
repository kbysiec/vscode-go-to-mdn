import { assert } from "chai";
import * as dataConverter from "../../dataConverter";
import * as mock from "../mocks";
import { getTestSetups } from "../testSetup/dataConverter.testSetup";

type SetupsType = ReturnType<typeof getTestSetups>;

describe("DataConverter", () => {
  let setups: SetupsType;

  before(() => {
    setups = getTestSetups();
  });
  afterEach(() => setups.afterEach());

  describe("prepareQpData", () => {
    it("1: should return array of QuickPickItem", () => {
      const actual = dataConverter.prepareQpData(mock.items);
      assert.deepEqual(actual, mock.qpItems);
    });
  });
});
