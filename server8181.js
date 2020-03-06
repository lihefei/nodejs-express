//引入http模块
var http = require("http");
//设置主机名
var hostName = '127.0.0.1';
//设置端口
var port = 8181;
//创建服务
var server = http.createServer(function(req, res) {

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.write('[{"content":"hello"}]');
    res.end();

});
server.listen(port, hostName, function() {
    console.log(`服务器运行在http://${hostName}:${port}`);
});