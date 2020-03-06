var express = require('express');
var fs = require('fs');
var app = express();
var hostName = '127.0.0.1';
var port = 8777;

app.use(function(req, res) {

    const url = req.url;
    console.log('当前请求的url是：', url);

    res.setHeader('Content-Type', 'text/html');

    if (url === '/' || url === '/index') {
        fs.readFile('./public/index.html', 'utf-8', function(err, data) {
            if (err) {
                throw err;
            }
            res.send(data);
        });

    } else if (url === '/login') {
        fs.readFile('./public/login.html', 'utf-8', function(err, data) {
            if (err) {
                throw err;
            }
            res.send(data);
        });
    } else {

        fs.readFile('./public/notFount.html', 'utf-8', function(err, data) {
            if (err) {
                throw err;
            }
            res.send(data);
        });
    }

});

app.listen(port, hostName, function() {

    console.log(`服务器运行在http://${hostName}:${port}`);

});