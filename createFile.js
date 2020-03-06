const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser'); //对post请求的请求体进行解析
const app = express();
app.use(bodyParser.urlencoded({ extended: false })); //bodyParser.urlencoded 用来解析 request 中 body的 urlencoded字符， 只支持utf-8的编码的字符,也支持自动的解析gzip和 zlib。返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
const hostname = require('./lib/getIPAdress');
const port = 8992;
const host = hostname + ':' + port;

app.get('/createFile', function(req, res) {

    
    const html =
    `<!DOCTYPE html>
    <html>
        <head>
        <meta charset="utf-8" >
        <title>Nodejs创建文件</title>
        </head>
        <body>
            <form action="http://${host}/saveFile" method="get">
                <div><lable>&emsp;文件名：</lable><input name="name" type="text"></div><br>
                <div><lable>文件格式：</lable><input type="text" name="suffix"></div><br>
                <div><lable>&emsp;&emsp;内容：</lable><textarea name="content" rows="6" cols="36"></textarea></div><br>
                <div><lable>&emsp;&emsp;&emsp;&emsp;&emsp;</lable><input type="submit" value="&emsp;提交&emsp;"></div>
            </form>
        </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});



app.get('/saveFile', function(req, res) {

    const folder = 'file/'; //保存至目录下的file文件夹

    /* 如果文件夹不存在则创建 */
    fs.mkdir(folder, function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("目录创建成功。");
    });

    const name = req.query.name || 'unnamed'; //文件名
    const suffix = req.query.suffix || 'txt'; //文件格式
    const fullName = folder + name + '.' + suffix;  //文件全名
    const content = req.query.content || ''; //文件内容

    const file = path.join(__dirname, fullName);

    /* 写入文件 */
    fs.writeFile(file, content, function(err) {
        if (err) {
            return console.log(err);
        }

        const html = 
        `<!DOCTYPE html>
        <html>
            <head>
            <meta charset="utf-8" >
            <title>创建状态</title>
            </head>
            <body>
                <p>文件创建成功，地址为：${host}/${fullName}</p>
                <a href="http://${host}/createFile">返回创建页面</a>
            </body>
        </html>`;

        res.setHeader('Content-Type', 'text/html');
        res.send(html);

    });


});


app.listen(port, hostname, function() {

    console.log(`服务器运行在http://${host}`);

});