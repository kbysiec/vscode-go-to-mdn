import * as vscode from "vscode";

export function getConfiguration<T>(section: string, defaultValue: T): T {
  const config = vscode.workspace.getConfiguration("");
  return config.get<T>(section, defaultValue);
}