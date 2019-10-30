import * as vscode from "vscode";
import ExtensionController from "./ExtensionController";

export async function activate(context: vscode.ExtensionContext) {
  console.log('Extension "Go to MDN" has been activated.');

  context.subscriptions.push(
    vscode.commands.registerCommand("goToMDN.browse", async () => {
      const controller = new ExtensionController(context);
      await controller.showQuickPick();
    }),
    vscode.commands.registerCommand("goToMDN.clearCache", async () => {
      const controller = new ExtensionController(context);
      await controller.clearCache();
      vscode.window.showInformationMessage(
        "Go to MDN extension: cache cleared"
      );
    }),
  );
}

export function deactivate() { }
