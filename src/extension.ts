import * as vscode from 'vscode';
import { html } from './test.js';

export function activate(context: vscode.ExtensionContext) {
  let input = vscode.commands.registerCommand('big.bigger', function () {
    const {
      activeTextEditor
    } = vscode.window
    vscode.window.showInputBox(
      {
        password: false, 
        ignoreFocusOut: true, 
        placeHolder: 'Enter the text you want to comment', 
        prompt: 'The default size is 32*32', 
        validateInput: function (text) {
          if (text.length == 0) {
            return 'please enter'
          }
        }
      }).then((inputStr) => new Promise((resolve, reject) => {
        const options = {
          enableScripts: true
        }
        const panel = vscode.window.createWebviewPanel(
          'webview',
          "webview",
          vscode.ViewColumn.One,
          options
        );
        const size = vscode.workspace.getConfiguration().get('Big.size');
        const character:string|undefined = vscode.workspace.getConfiguration().get('Big.character')
        const char = character as string + character;
        const font = 'px '+vscode.workspace.getConfiguration().get('Big.font');
        const input = `var cols = ${size};var	rows = ${size};var font = '${font}';var char = '${char}'`
        const modal = html.replace('$[input]$',input)
        panel.webview.html = modal
        panel.webview.postMessage({ inputStr: inputStr });
        panel.webview.onDidReceiveMessage(message => {
          resolve(message)
          panel.dispose()
        }, undefined, context.subscriptions);
      }))
      //disable
      .then((output:any) => {
        const change = new vscode.WorkspaceEdit()
        const uri = activeTextEditor?.document.uri
        var position = new vscode.Position(activeTextEditor.selection.active.line, activeTextEditor.selection.active.character);
        uri && change.insert(uri,position,'\n')
        output.forEach((e: string) => {
          uri && change.insert(uri,position,'//' + e + '\n')
        })
        vscode.workspace.applyEdit(change)
      })
      ;
  })
  context.subscriptions.push(input);
}

// this method is called when your extension is deactivated
export function deactivate() { }
