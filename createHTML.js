const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const hostName = require('./lib/getIPAdress');
const port = 8999;
const pathname = '/createHTML';

app.get(pathname, function(req, res) {

    
    const html =
    `<!DOCTYPE html>
    <html>
        <head>
        <meta charset="utf-8" >
        <title>Nodejs创建html页面</title>
        <link rel="stylesheet" href="http://${hostName}:8998/createCSS">
        
        </head>
        <body>
			<header>头部</header>
			<main>主体</main>
			<footer>底部</footer>
            <script src="http://${hostName}:8997/createJS"></script>
        </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});


app.listen(port, hostName, function() {

    console.log(`服务器运行在http://${hostName}:${port}`);

});
