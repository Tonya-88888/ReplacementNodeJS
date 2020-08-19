

var http = require('http');
var url = require('url');

const TextToSVG = require('text-to-svg');
var fs = require('fs');
const express = require("express");
const router = express.Router();
const { parse } = require('querystring');
const crypto = require('crypto');
var port = process.env.PORT || 1337;



http.createServer(function (req, res) {


    res.setHeader("UserId", 12);
  
    let urlParts = url.parse(req.url);
    console.log(urlParts.pathname);

    if (req.method == "GET") {
        switch (urlParts.pathname) {

            case "/encode":
               
              Encode(req, res);
        
                break;

            case "/image":
                Image(req, res);

                break;

            default:
               
                res.setHeader("Content-Type", "text/html; charset=utf-8;");

                let a = fs.readFileSync("index1.html");
                res.write(a);
                break;
        }
    }


    res.end();
   

}).listen(port);



function Encode(req, res) {



    let urlRequest = url.parse(req.url, true);
    let str = urlRequest.query.text;

    let text = EncryptData(str);

    let buff = new Buffer(text);
    let base64data = buff.toString('base64');

    res.write("/image?text=" + base64data);

  
}

function Image(req, res) {

    res.writeHead(200, { 'Content-Type': 'image/svg+xml' });

    const textToSVG = TextToSVG.loadSync();
    const attributes = { fill: 'black' };
    const options = { x: 0, y: 0, fontSize: 16, anchor: 'top', attributes: attributes };

    let urlRequest = url.parse(req.url, true);
    let str = urlRequest.query.text;


 let buff = new Buffer(str, 'base64');
 let text = buff.toString('ascii');

 let mystr = DecryptData(text);
 

    res.write(textToSVG.getSVG(mystr, options));

}

function GenerateKey() {
    const key = crypto.scryptSync('secret', 'salt', 32); 
    fs.writeFileSync("key.config", key);
}

function ReadKey() {

    let key =  fs.readFileSync("key.config");

    return key;
}

function EncryptData(str) {

    let key = ReadKey();

    var encrypt = crypto.createCipher('aes256', key);
    var encrypted = encrypt.update(str, 'utf8', 'hex');
    encrypted += encrypt.final('hex');


    return encrypted;
}

function DecryptData(str) {

    let key = ReadKey();

   // const key = crypto.scryptSync('secret', 'salt', 32);

    var decrypt = crypto.createDecipher('aes256', key);
    var decrypted = decrypt.update(str, 'hex', 'utf8');
    decrypted += decrypt.final();

    console.log(decrypted); 

    return decrypted;
}