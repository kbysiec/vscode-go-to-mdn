import Utils from "../../utils";
import { createStubInstance } from "./stubbedClass";
import Config from "../../config";

export function getUtilsStub(): Utils {
  const utilsStubTemp: any = createStubInstance(Utils);

  return utilsStubTemp as Utils;
}

export function getConfigStub(): Config {
  const configStub: any = createStubInstance(Config);
  configStub.default = getConfiguration().goToMDN;

  return configStub as Config;
}

export const getConfiguration = (): { [key: string]: any } => {
  return {
    goToMDN: {
      githubPersonalAccessToken: "test github token",
      shouldDisplayFlatList: true,
    },
  };
};
