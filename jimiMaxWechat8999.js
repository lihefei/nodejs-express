var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser'); //对post请求的请求体进行解析
var Mock = require('mockjs');
var app = express();
app.use(bodyParser.urlencoded({ extended: false })); //bodyParser.urlencoded 用来解析 request 中 body的 urlencoded字符， 只支持utf-8的编码的字符,也支持自动的解析gzip和 zlib。返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
var formatDateTime = require('./lib/formatDateTime');
var hostName = require('./lib/getIPAdress');
var port = 8999;



app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});





var requestUrl = {
    deviceList: '/api/jimiMaxWechat/deviceList',
    validAuth: '/api/jimiMaxWechat/validAuth'
};


packageServer(requestUrl.deviceList, function(req, res) {
    deviceListSend(req, res);
});

packageServer(requestUrl.validAuth, function(req, res) {
    validAuthSend(req, res);
});


/**
 * [packageServer 包装get和post服务]
 * @param  {string}   url [请求接口地址]
 * @param  {Function} fn  [请求成功后的回调函数]
 */
function packageServer(url, fn) {
    app.get(url, fn);
    app.post(url, fn);
}


/**
 * deviceListSend 发送设备列表数据]
 * @param  {object}   req [请求接口对象]
 * @param  {object}   res [响应接口对象]
 */
function deviceListSend(req, res) {

    var method = req.query ? 'GET' : 'POST';
    console.log(`请求地址：http://${hostName}:${port}` + req.path, '\n请求方式：' + method, '\n请求参数：', req.query || req.body);

    var len = (req.query || req.body).imei ? '1' : '10';
    console.log(len);

    var Random = Mock.Random;
    Random.datetime();
    var data = Mock.mock({
        code: 0,
        message: 'ok',
        ['result|' + len]: [{
            'imei|+1': 800000000000000,
            //'lng|-180-180.2-5': 0,
            'lng|116.6': 0,
            'lat|39-40.6': 0,
            'gpsTime': '@datetime',
            'hbTime': '@datetime',
            'status|1': [0, 1, 2, 3],
            'posType|1': ['GPS', 'LBS', 'WIFI', 'BEACON'],
            'deviceName|+1': [
                'GTL100',
                'GTL200',
                'GTL300',
                'GTL400',
                'GTL500',
                'GTL600',
                'GTL700',
                'GTL800',
                'GTL900',
                'GTL1000'
            ],
            'accStatus|1': [0, 1],
            'speed|30-180': 50,
            'speedType|1': [-1, 0, 1, 2, 3],
            'gpsNum|0-20': 1,
            'electQuantity|0-100': 50,
            'idelTiem|1-100': 20,
            'direction|0-359': 90,
            'accFlag|1': [0, 1],
            'gpsSignal|1': [0, 1, 2, 3, 4],
            'isPromptlyPos|1': [0, 1],
            'promptlyPosIns': '',
            'baiduAddr': '广东省深圳市宝安区高新奇',
            'icon|1': [
                'automobile',
                'truck',
                'bus',
                'taxi',
                'mtc',
                'per',
                'cow',
                'plane',
                'policeCar',
                'policeMtc',
                'ship',
                'electric',
                'other'
            ],
        }]
    });

    /* 如果是一个对象就包装为一个数组 */
    if (!Array.isArray(data.result)) {
        var originProto = Object.getPrototypeOf(data.result);
        var clone =  Object.assign(Object.create(originProto), data.result);
        var arr = [];
        arr.push(clone);
        data.result = arr;
    }

    res.send(data);
}


/**
 * validAuthSend 验证用户]
 * @param  {object}   req [请求接口对象]
 * @param  {object}   res [响应接口对象]
 */
function validAuthSend(req, res) {

    var method = req.query ? 'GET' : 'POST';
    console.log(`请求地址：http://${hostName}:${port}` + req.path, '\n请求方式：' + method, '\n请求参数：', req.query || req.body);

    var data = {
        code: 0,
        message: 'ok',
        result: ''
    };
    if ((req.query || req.body).token) {
        data.code = 302;
        data.result = '';
    }
    res.send(data);
}




app.listen(port, hostName, function() {

    var date = formatDateTime();

    console.log(`[${date}] 服务器运行在http://${hostName}:${port}`);

    var apiList = [];
    for (var key in requestUrl) {
        apiList.push(`http://${hostName}:${port}` + requestUrl[key]);
    }
    console.log(`[${date}] 接口列表:` + JSON.stringify(apiList));

});