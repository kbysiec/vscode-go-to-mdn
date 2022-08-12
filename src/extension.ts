import * as vscode from "vscode";
import { extensionController } from "./extensionController";

export async function browse() {
  await extensionController.browse();
}

export function clearCache() {
  extensionController.clear();
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('Extension "Go to MDN" has been activated.');

  extensionController.init(context);

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
