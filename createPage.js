const express = require('express');
const fs = require('fs');

const app = express();
const hostname = require('./lib/getIPAdress');
const port = 8999;
const host = hostname + ':' + port;

/**
 * 封装get请求
 * @param {object} params 配置项
 * @param {string} params.url  请求地址 
 * @param {string} params.type  输出文件类型
 * @param {string | function} params.content  输出类容  
 */
function get(params) {
    const url = params.url || '',
        content = params.content || '',
        type = params.type || 'html';

    app.get(url, function(req, res) {
        res.setHeader('Content-Type', `text/${type}`);
        res.send(content);
    });
}


get({
    url: '/getHTML',
    type: 'html',
    content:  `<!DOCTYPE html>
    <html>
        <head>
        <meta charset="utf-8" >
        <title>Nodejs创建html页面</title>
        <link rel="stylesheet" href="http://${host}/getCSS">
        
        </head>
        <body>
            <header>头部</header>
            <main>主体</main>
            <footer>底部</footer>
            <script src="http://${host}/getJS"></script>
        </body>
    </html>`
});

get({
    url: '/getCSS',
    type: 'css',
    content:  `header {
        background-color: red;
    }

    main {
        background-color: yellow;
    }

    footer {
        background-color: green;
    }`
});

http({
    url: '/getJS',
    type: 'javascript',
    content:  `const test = function() {
        console.log('test');
    }
    test();`
});


app.listen(port, hostname, function() {

    console.log(`服务器运行在http://${host}`);

});