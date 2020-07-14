import Utils from "../../utils";
import { createStubInstance } from "./stubbedClass";

export function getUtilsStub(): Utils {
  const utilsStubTemp: any = createStubInstance(Utils);

  return utilsStubTemp as Utils;
}
