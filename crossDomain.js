const express = require('express');
const app = express();
const hostname = require('./lib/getIPAdress');
const port = 8991;
const host = hostname + ':' + port;


app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});


app.get('/test', function(req, res) {
    res.send('我是跨域请求的内容');
});


app.listen(port, hostname, function() {

    console.log(`服务器运行在http://${host}`);

});