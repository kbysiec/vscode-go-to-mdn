import * as vscode from "vscode";
import ExtensionController from "./ExtensionController";

export async function browse(context: vscode.ExtensionContext) {
  const controller = new ExtensionController(context);
  await controller.showQuickPick();
}

export function clearCache(context: vscode.ExtensionContext) {
  const controller = new ExtensionController(context);
  controller.clearCache();
  vscode.window.showInformationMessage("Go to MDN extension: cache cleared");
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('Extension "Go to MDN" has been activated.');

  context.subscriptions.push(
    vscode.commands.registerCommand("goToMDN.browse", browse),
    vscode.commands.registerCommand("goToMDN.clearCache", clearCache)
  );
}

export function deactivate() {
  console.log('Extension "Go to MDN" has been deactivated.');
}
