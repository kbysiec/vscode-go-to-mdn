import * as vscode from "vscode";
import ExtensionController from "./ExtensionController";

export async function activate(context: vscode.ExtensionContext) {
  console.log('Extension "vscode-go-to-mdn" has been activated.');

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.goToMdn", async () => {
      const controller = new ExtensionController(context);
      await controller.showQuickPick();
    }),
    vscode.commands.registerCommand("extension.clearCache", async () => {
      const controller = new ExtensionController(context);
      await controller.clearCache();
      vscode.window.showInformationMessage(
        "Go to MDN extension: cache cleared"
      );
    })
  );
}

export function deactivate() {}
