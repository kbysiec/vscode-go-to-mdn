import * as vscode from "vscode";
import ConfigKey from "./enums/configKey";

class Config {
  private default = {
    githubPersonalAccessToken: "",
    shouldDisplayFlatList: true,
  };
  private readonly defaultSection = "goToMDN";

  getGithubPersonalAccessToken(): string {
    return this.get(
      ConfigKey.githubPersonalAccessToken,
      this.default.githubPersonalAccessToken
    );
  }

  shouldDisplayFlatList(): boolean {
    return this.get(
      ConfigKey.shouldDisplayFlatList,
      this.default.shouldDisplayFlatList
    );
  }

  private get<T>(key: string, defaultValue: T): T {
    const cacheKey = `${this.defaultSection}.${key}`;
    return this.getConfiguration<T>(cacheKey, defaultValue);
  }

  private getConfiguration<T>(section: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration("");
    return config.get<T>(section, defaultValue);
  }
}

export default Config;
