import * as vscode from "vscode";

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

export const getConfiguration = (): {
  [key: string]: { [key: string]: string | boolean };
} => {
  return {
    goToMDN: {
      githubPersonalAccessToken: "test github token",
      shouldDisplayFlatList: true,
    },
  };
};

export const getVscodeConfiguration = (configuration: {
  [key: string]: any;
}): ReturnType<typeof vscode.workspace.getConfiguration> => {
  return {
    get: (section: string) =>
      section.split(".").reduce((cfg, key) => cfg[key], configuration),
    has: () => true,
    inspect: () => undefined,
    update: () => Promise.resolve(),
  };
};
