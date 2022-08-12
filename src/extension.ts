import * as vscode from "vscode";
import { controller } from "./controller";

export async function browse() {
  await controller.browse();
}

export function clearCache() {
  controller.clear();
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('Extension "Go to MDN" has been activated.');

  controller.init(context);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "goToMDN.browse",
      browse.bind(null, controller)
    ),
    vscode.commands.registerCommand(
      "goToMDN.clearCache",
      clearCache.bind(null, controller)
    )
  );
}
