import { assert } from "chai";
import { isValueStringType } from "../../utils";
import QuickPickExtendedItem from "../../interfaces/QuickPickExtendedItem";
import ItemType from "../../enums/ItemType";

describe('Utils', function () {
  describe('isValueStringType', function () {
    it('function exists', function () {
      assert.equal(typeof (isValueStringType), "function");
    });

    it('should return true if value is a string', function () {
      const isString = isValueStringType("aaa");
      assert.equal(isString, true);
    });

    it('should return false if value is not a string', function () {
      const qpItem: QuickPickExtendedItem = { label: "test-label", url: "#", type: ItemType.Directory, breadcrumbs: [] };
      const isString = isValueStringType(qpItem);
      assert.equal(isString, false);
    });
  });
});
