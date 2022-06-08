import * as vscode from "vscode";
import { createExtensionController } from "./extensionController";

export async function browse(
  extensionController: ReturnType<typeof createExtensionController>
) {
  await extensionController.browse();
}

export function clearCache(
  extensionController: ReturnType<typeof createExtensionController>
) {
  extensionController.clear();
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('Extension "Go to MDN" has been activated.');

  const extensionController = createExtensionController(context);

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
