let express = require('express');
let request = require('request');
let urlencode = require('urlencode');
let app = express();

const hostName = '127.0.0.1';
const port = 8666;

let config = {
    wechat: {
        token: 'lihefei',
        appid: 'wx4a123d5017f9e248',
        secret: 'ae3ed9ffb603b7bbcf8383c3c9827d9c',
        grant_type: 'client_credential'
    }
};


let weixin = {

    getOpenId: function() {
        let appid = config.wechat.appid;
        let redirect_uri = urlencode('http://leeandfly.wicp.net/weixin');
        let scope = 'snsapi_userinfo';
        let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=STATE&connect_redirect=1#wechat_redirect`;
        //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4a123d5017f9e248&redirect_uri=http%3A%2F%2Fleeandfly.wicp.net%2Fweixin&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect
        return url;
    },
    getTemplateId: function() {
        return '-RniQtY7d9nPKtpwsdtM5oQoFDAY7yTj_xIhPv1Snbo';
    },
    getFormId: function() {

    },
    getAccessToken: function(fn) {

        let url = 'https://api.weixin.qq.com/cgi-bin/token?appid=' + config.wechat.appid + '&secret=' + config.wechat.secret + '&grant_type=' + config.wechat.grant_type;

        request({
            url: url,
            json: true,
            headers: {
                'content-type': 'application/json',
            }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                fn && fn(body);
            }
        });
    },
    send: function() {
        let touser = '';
        let template_id = '-RniQtY7d9nPKtpwsdtM5oQoFDAY7yTj_xIhPv1Snbo';
        let form_id;
        let data = {
            'keyword1': {
                'value': '震动报警',
                'color': '#1d1d1d'
            },
            'keyword2': {
                'value': '2018/08/14 12:15:24',
                'color': '#1d1d1d'
            },
            'keyword3': {
                'value': param.time,
                'color': '#1d1d1d'
            }
        };
    }
};

/*weixin.getAccessToken(function(data) {
    //console.log(data.access_token);
    console.log(weixin.getFormId());
});*/

console.log(weixin.getOpenId());


app.listen(port, hostName, function() {

    console.log(`服务器运行在http://${hostName}:${port}`);

});