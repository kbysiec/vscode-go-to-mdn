import * as vscode from "vscode";

const keys = {
  shouldDisplayFlatList: {
    name: "shouldDisplayFlatList",
    defaultValue: true,
  },
  githubPersonalAccessToken: {
    name: "githubPersonalAccessToken",
    defaultValue: "",
  },
};

function get<T>(key: string, defaultValue: T): T {
  const cacheKey = `goToMDN.${key}`;
  return getConfiguration<T>(cacheKey, defaultValue);
}

function getConfiguration<T>(section: string, defaultValue: T): T {
  const config = vscode.workspace.getConfiguration("");
  return config.get<T>(section, defaultValue);
}

export function getGithubPersonalAccessToken(): string {
  return get(
    keys.githubPersonalAccessToken.name,
    keys.githubPersonalAccessToken.defaultValue
  );
}

export function shouldDisplayFlatList(): boolean {
  return get(
    keys.shouldDisplayFlatList.name,
    keys.shouldDisplayFlatList.defaultValue
  );
}
