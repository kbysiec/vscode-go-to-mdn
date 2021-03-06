import * as vscode from "vscode";
import * as sinon from "sinon";
import Utils from "../../utils";
import { createStubInstance } from "./stubbedClass";
import Config from "../../config";
import Cache from "../../cache";

export const getExtensionContext = (): vscode.ExtensionContext => {
  return {
    subscriptions: [],
    workspaceState: {
      get: () => {},
      update: () => Promise.resolve(),
    },
    globalState: {
      get: () => {},
      update: () => Promise.resolve(),
    },
    extensionPath: "",
    storagePath: "",
    globalStoragePath: "",
    logPath: "",
    asAbsolutePath: (relativePath: string) => relativePath,
  } as vscode.ExtensionContext;
};

export const getConfiguration = (): { [key: string]: any } => {
  return {
    goToMDN: {
      githubPersonalAccessToken: "test github token",
      shouldDisplayFlatList: true,
    },
  };
};

export const getVscodeConfiguration = (configuration: {
  [key: string]: any;
}) => {
  return {
    get: (section: string) =>
      section.split(".").reduce((cfg, key) => cfg[key], configuration),
    has: () => true,
    inspect: () => undefined,
    update: () => Promise.resolve(),
  };
};

export function getUtilsStub(): Utils {
  const utilsStubTemp: any = createStubInstance(Utils);

  return utilsStubTemp as Utils;
}

export function getConfigStub(): Config {
  const configStub: any = createStubInstance(Config);
  configStub.default = getConfiguration().goToMDN;

  return configStub as Config;
}

export function getCacheStub(): Cache {
  const cacheStubTemp: any = sinon.createStubInstance(Cache);
  cacheStubTemp.extensionContext = getExtensionContext();
  return cacheStubTemp as Cache;
}
