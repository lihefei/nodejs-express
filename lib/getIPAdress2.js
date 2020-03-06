
var http = require('http');

http.get('http://ip.taobao.com/service/getIpInfo.php?ip=myip', function(req, res) {
    console.info(res);
});