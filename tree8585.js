var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser'); //对post请求的请求体进行解析
var app = express();
app.use(bodyParser.urlencoded({ extended: false })); //bodyParser.urlencoded 用来解析 request 中 body的 urlencoded字符， 只支持utf-8的编码的字符,也支持自动的解析gzip和 zlib。返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
var hostName = '172.16.2.123';
var port = 8585;

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});


var requestUrl = {
    simCardRenewal: '/api/tuqiang/tree'
};


packageServer(requestUrl.simCardRenewal, function(req, res) {
    var id =  (req.query|| req.body).id || '';

    var url = 'data/tree/tree' + (id ? ('id' + id ) : '') + '.json';

    readParseSend(req, res, url);
});


/**
 * [packageServer 包装get和post服务]
 * @param  {string}   url [请求接口地址]
 * @param  {Function} fn  [请求成功后的回调函数]
 */
function packageServer(url, fn){
    app.get(url, fn);
    app.post(url, fn);
}


/**
 * [readParseSend 读取本地json文件并发送数据]
 * @param  {object}   req [请求接口对象]
 * @param  {object}   res [响应接口对象]
 * @param  {string} jsonUrl  [json文件地址]
 */
function readParseSend(req, res, jsonUrl) {

    var method = req.query ? 'GET' : 'POST';
    console.log(`请求地址：http://${hostName}:${port}` + req.path, '\n请求方式：' + method, '\n请求参数：', req.query||req.body);

    var file = path.join(__dirname, jsonUrl);
    console.log('json文件路径：', file);

    fs.readFile(file, 'utf-8', function(err, data) {
        if (err) {
            res.send('文件读取失败');
        } else {
            res.send(data);
        }
    });
}

app.listen(port, hostName, function() {

    console.log(`服务器运行在http://${hostName}:${port}`);

    var apiList = [];
    for(var  key in requestUrl) {
        apiList.push(`http://${hostName}:${port}` + requestUrl[key]);
    }
    console.log('接口列表:' + JSON.stringify(apiList));

});