var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser'); //对post请求的请求体进行解析
var app = express();
app.use(bodyParser.urlencoded({ extended: false })); //bodyParser.urlencoded 用来解析 request 中 body的 urlencoded字符， 只支持utf-8的编码的字符,也支持自动的解析gzip和 zlib。返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
var hostName = '172.16.2.123';
var port = 8888;

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});


app.get('/api/createImg', function(req, res) {
    console.log('post', '请求参数：', req.query);

    var name = req.query.name || 'Noname';
    var fullName = 'data/' + name + '.json';
    var length = req.query.length || 100;

    var data = {
        code: 0,
        ok: true,
        list: []
    };
    for (var i=0; i < length; i++) {
        var obj = {
            name: '张三' + i,
            age: i
        };
        data.list.push(obj);
    }

    var content = JSON.stringify(data);

    var file = path.join(__dirname, fullName);

    fs.writeFile(file, content, function(err) {
        if (err) {
            return console.log(err);
        }
        var url = `http://127.0.0.1:8181/${fullName}`;
        res.send(`文件创建成功，url为${url}`);

    });
});

app.post('/api/createJson', function(req, res) {
    console.log('post', '请求参数：', req.body);

    var name = req.body.name || 'Noname';
    var fullName = 'data/' + name + '.json';
    var length = req.body.length || 100;

    var data = {
        code: 0,
        ok: true,
        list: []
    };
    for (var i=0; i < length; i++) {
        var obj = {
            name: '张三' + i,
            age: i
        };
        data.list.push(obj);
    }

    var content = JSON.stringify(data);

    var file = path.join(__dirname, fullName);

    fs.writeFile(file, content, function(err) {
        if (err) {
            return console.log(err);
        }
        var url = `http://127.0.0.1:8181/${fullName}`;
        res.send(`文件创建成功，url为${url}`);

    });
});



app.listen(port, hostName, function() {

    console.log(`服务器运行在http://${hostName}:${port}`);

});