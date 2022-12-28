import * as vscode from 'vscode';
import { html } from './test.js';

export function activate(context: vscode.ExtensionContext) {
  let input = vscode.commands.registerCommand('big.bigger', function () {
    const {
      activeTextEditor
    } = vscode.window
    vscode.window.showInputBox(
      { // 这个对象中所有参数都是可选参数
        password: false, // 输入内容是否是密码
        ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
        placeHolder: '输入希望注释的文字', // 在输入框内的提示信息
        prompt: '默认大小为32*32', // 在输入框下方的提示信息
        validateInput: function (text) {
          if (text.length == 0) {
            return '请输入'
          }
        }
      }).then((inputStr) => new Promise((resolve, reject) => {
        const options = {
          enableScripts: true
        }
        const panel = vscode.window.createWebviewPanel(
          'webview',
          "测试webview",
          vscode.ViewColumn.One,
          options
        );
        panel.webview.html = html
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
        activeTextEditor && output.forEach((e: string) => {
          var position = new vscode.Position(activeTextEditor.selection.active.line, activeTextEditor.selection.active.character);
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
