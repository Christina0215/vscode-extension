const html:string = 
`<html>
<body>
<script>
  window.addEventListener('message', event => {
    const message = event.data;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var cols = 32;
    var	rows = 32;
    cols = message.inputStr.length * 32
    canvas.width = cols;
    canvas.height = rows;
    ctx.clearRect(0,0,cols,rows);
    ctx.font = 32+"px SimSun";
    ctx.fillStyle = "#000";
    ctx.fillText(message.inputStr, 0, 28);
    var data = ctx.getImageData(0, 0, cols, rows)
    const output = [];
    for(let i = 1; i <= rows; i++){
      let res = ''
      for(let j = 1; j <= cols; j++){
        var pos = (( i-1 )*cols+( j ))*4 -1;
        if(data.data[pos] > 0){
          res += "*"
        }else{
          res+=' '
        }
      }
      output.push(res)
    }
    const vscode = acquireVsCodeApi();
    vscode.postMessage(output);
  })
</script>
</body>
</html>`

export {html};