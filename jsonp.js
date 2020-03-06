/*var express = require('express');
var router = express.Router();
var urllib = require('url');
var app = express();
var hostName = '172.16.2.123';
var port = 8888;



router.get('/jsonp', function(req, res, next) {
    var params = urllib.parse(req.url, true);

    console.log(params);
    var query = params.query;


    var data = {
        name: 'zhangsan',
        height: 180,
        weight: 70,
        age: 45,
        sex:  'male'
    };

    data = JSON.stringify(data);

    if (req.query && query.callback) {
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});

       var string = query.callback + '(' + data + ')';
       console.log(params);
       res.end(string);

    } else {
        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
        res.end(data);
        console.log(params);
    }
});


app.listen(port, hostName, function() {

    console.log(`服务器运行在http://${hostName}:${port}`);

});









*/

var express = require('express');
var router = express.Router();
var urllib = require('url');

router.get('/simpleJsonp', function (req, res, next){
    var params = urllib.parse(req.url, true);
    var reqData = {};
    var query = params.query;
    
    
    //res.send(reqData);
    //console.log(params);

        // todo somthing 
    if(params.query && params.query.callback){
        var str =  params.query.callback + '(' + JSON.stringify(reqData) + ')';//jsonp  
        res.end(str);
    }else{
        res.end(JSON.stringify(reqData));
    }
});