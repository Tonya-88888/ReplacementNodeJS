

var http = require('http');
const TextToSVG = require('text-to-svg');
var fs = require('fs');
const { parse } = require('querystring');
var port = process.env.PORT || 1337;

http.createServer(function (req, res) {

   

    res.setHeader("UserId", 12);
    res.setHeader("Content-Type", "text/html; charset=utf-8;");

    var a = fs.readFileSync("index1.html");
    res.write(a);

    const textToSVG = TextToSVG.loadSync();
    const attributes = { fill: 'black'};
    const options = { x: 0, y: 0, fontSize: 16, anchor: 'top', attributes: attributes };
    var svg;

   
    //POST
    if (req.method == 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {

            let params = parse(body);
            svg = textToSVG.getSVG(params.text, options);

          
            res.write(`  <div class="container"> <div class="row">
            <div class="col-sm">
                ${params.text}
            </div>
            <div class="col-sm">
               ${svg}
            </div>
        </div> </div>`);
          
            res.end();
        });
       
    }

}).listen(port);
