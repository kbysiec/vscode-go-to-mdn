import { QuickPickItem as QuickPickItemVscode } from "vscode";

interface QuickPickItem extends QuickPickItemVscode {
  url: string;
  breadcrumbs: string[];
}

export default QuickPickItem;
