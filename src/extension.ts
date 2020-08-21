import * as vscode from "vscode";
import ExtensionController from "./ExtensionController";

export async function browse(extensionController: ExtensionController) {
  await extensionController.browse();
}

export function clearCache(extensionController: ExtensionController) {
  extensionController.clearCache();
  vscode.window.showInformationMessage("Go to MDN extension: cache cleared");
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('Extension "Go to MDN" has been activated.');

  const extensionController: ExtensionController = new ExtensionController(
    context
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "goToMDN.browse",
      browse.bind(null, extensionController)
    ),
    vscode.commands.registerCommand(
      "goToMDN.clearCache",
      clearCache.bind(null, extensionController)
    )
  );
}

export function deactivate() {
  console.log('Extension "Go to MDN" has been deactivated.');
}
