var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser'); //对post请求的请求体进行解析
var app = express();
app.use(bodyParser.urlencoded({ extended: false })); //bodyParser.urlencoded 用来解析 request 中 body的 urlencoded字符， 只支持utf-8的编码的字符,也支持自动的解析gzip和 zlib。返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
var hostName = require('./lib/getIPAdress');
var port = 8888;

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});


var requestUrl = {
    layui: '/api/layui'
};


app.get(requestUrl.layui, function(req, res) {
    console.log('请求方式：get', '请求参数：', req.query);

    var page = req.query.page || '';
    var file = path.join(__dirname, 'data/layui/data' + page + '.json');

    fs.readFile(file, 'utf-8', function(err, data) {
        if (err) {
            res.send('文件读取失败');
        } else {
            res.send(data);
        }
    });
});

app.post(requestUrl.layui, function(req, res) {
    console.log('post', '请求参数：', req.body);

    var page = req.body.page || '';
    var file = path.join(__dirname, 'data/layui/data' + page + '.json');
    //var file = 'F:\\website\\nodejs\\data\\layui\\data.json';

    fs.readFile(file, 'utf-8', function(err, data) {
        if (err) {
            res.send('文件读取失败');
        } else {
            res.send(data);
        }
    });
});

app.listen(port, hostName, function() {

    console.log(`服务器运行在http://${hostName}:${port}`);
    console.log(`接口地址：http://${hostName}:${port}${requestUrl.layui}`);


});