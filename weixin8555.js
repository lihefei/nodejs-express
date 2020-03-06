const express = require('express');
const request = require('request');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser'); //对post请求的请求体进行解析
const sha1 = require('node-sha1');
const urlencode = require('urlencode');
const app = express();
app.use(bodyParser.urlencoded({ extended: false })); //bodyParser.urlencoded 用来解析 request 中 body的 urlencoded字符， 只支持utf-8的编码的字符,也支持自动的解析gzip和 zlib。返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
const hostName = '127.0.0.1';
const port = 8555;

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

const config = {
    wechat: {
        token: 'lihefei',
        appid: 'wx4a123d5017f9e248',
        secret: 'ae3ed9ffb603b7bbcf8383c3c9827d9c',
        grant_type: 'client_credential'
    }
};






/**
 * [验证微信接口配置信息]
 */
app.get('/', function(req, res) {

    console.log(req.query);

    //验证微信接口的安全性
    function verifyWeChatInterface() {
        var token = config.wechat.token; //获取自定义标记

        var signature = req.query.signature; //获取微信请求的签名
        var nonce = req.query.nonce; //获取微信请求的随机数
        var timestamp = req.query.timestamp; //获取微信请求的时间戳

        var str = [token, timestamp, nonce].sort().join(''); //排序自定义标记和微信请求的参数，组合转换为字符串

        var sha = sha1(str); //加密字符串

        var result = sha === signature; //加密字符串是否等于签名
        return result;
    }

    var result = verifyWeChatInterface(); //获取安全验证结果

    if (result) {
        var echostr = req.query.echostr; //获取微信请求的字符串
        res.send(echostr + ''); //返回响应接口数据
    } else {

        fs.readFile('./public/weixin/index.html', 'utf-8', function(err, data) {
            if (err) {
                res.send('页面读取错误');
            } else {
                res.setHeader('Content-Type', 'text/html');
                res.send(data);

            }
        });
    }

});


/**
 * 获取code并保存到本地
 */


app.get('/code', function(req, res) {


    const code = req.query.code;
    const appid = config.wechat.appid;
    const secret = config.wechat.secret;

    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;


    request(url, function(error, response, body) {

        if (!error && response.statusCode == 200) {

            const file = path.join(__dirname, 'data/weixin/openid');
            const content = JSON.parse(body).openid;

            //写入文件
            fs.writeFile(file, content, function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log('文件创建成功，地址：' + file);

                const html = htmlTemplate({
                    title: '文件创建成功',
                    content: `<h3>文件创建成功，地址：${file}</h3>`
                }, res);
                res.send(html);
            });
        }

    });
});


/**
 * 获取用户信息
 

function getUserInfo(param) {
    const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${param.access_token}&openid=${param.openid}&lang=zh_CN`;

    request(url, function(error, response, body) {

        if (!error && response.statusCode == 200) {
            //console.log('请求用户信息响应：', body);
            console.log('openid：', body.openid);

            sendTemplateMsg(body.openid);
        }

    });
}
*/


/**
 * 发送模板消息
 */

app.get('/sendTemplateMsg', function(req, res) {


    const file = path.join(__dirname, 'data/weixin/openid');

    fs.readFile(file, function(err, data) {
        if (err) {
            return console.error(err);
        }

        const openid = data.toString();

        getAccessToken(function(access_token) {
            sendTemplateMsg({
                openid,
                access_token
            });
        });
    });

    function sendTemplateMsg(param) {

        console.log(param);
        const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${param.access_token}`;
        const requestData = {
            touser: param.openid,
            template_id: '-RniQtY7d9nPKtpwsdtM5oQoFDAY7yTj_xIhPv1Snbo',
            url: 'http://weixin.qq.com/download',
            data: {
                first: {
                    value: '',
                    color: '#173177'
                },
                keyword1: {
                    value: '震动告警',
                    color: '#1d1d1d'
                },
                keyword2: {
                    value: '2018/08/14 12:15:24',
                    color: '#1d1d1d'
                },
                keyword3: {
                    value: '36.5272755433,105.3368893898',
                    color: '#1d1d1d'
                },
                keyword4: {
                    value: '甘肃省白银市平川区种田乡五星村北方向约3.77公里',
                    color: '#1d1d1d'
                },
                remark: {
                    value: '请注意处理！',
                    color: '#173177'
                }
            }
        };

        console.log(url);
        console.log(requestData);



        request({
            url: url,
            method: 'post',
            body: JSON.stringify(requestData)
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        });
    }


    const html = htmlTemplate({
        title: '发送模消息',
        content: '<h3>发送模消息</h3>'
    }, res);

    res.send(html);

});


/**
 * [htmlTemplate 输出html模板]
 * @param  { object } param [需要传入的参数对象]
 * @param  { string } param title [文档标题]
 * @param  { string } param content [内容]
 * @param  { object } res [响应头对象]
 * 
 */
function htmlTemplate(param, res) {
    res.setHeader('Content-Type', 'text/html');
    let html =
        `<!DOCTYPE html>
    <html>
        <head>
        <meta charset="utf-8" >
        <meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0">
        <title>${param.title}</title>
        </head>
        <body>${param.content}</body>
    </html>`;
    return html;
}



/**
 * [updateAccessToken 更新access_token并保持到本地文件]
 */
function updateAccessToken(fn) {
    const appid = config.wechat.appid;
    const secret = config.wechat.secret;
    const grant_type = config.wechat.grant_type;

    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=${grant_type}&appid=${appid}&secret=${secret}`;



    request(url, function(error, response, body) {

        if (!error && response.statusCode == 200) {

            const file = path.join(__dirname, 'data/weixin/access_token');
            const content = JSON.parse(body).access_token;

            console.log(content);

            //写入文件
            fs.writeFile(file, content, function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log('文件创建成功，地址：' + file);

                fn && fn();
            });

        } else {
            throw 'update access_token error';
        }
    });
}

updateAccessToken();


/**
 * [getAccessToken 获取access_token]
 */
function getAccessToken(fn) {
    const file = path.join(__dirname, 'data/weixin/access_token');
    fs.readFile(file, 'utf-8', function(err, data) {
        if (err) {
            updateAccessToken(function() {
                getAccessToken(fn);
            });

        } else {
            const access_token = data.toString();
            console.log(access_token);
            fn && fn(access_token);
        }
    });
}








/**
 * [请求微信鉴权接口回调code]
 */
app.get('/authentication', function(req, res) {

    const appid = config.wechat.appid;
    const redirect_uri = urlencode('http://leeandfly.wicp.net/code');
    const scope = 'snsapi_userinfo';
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=STATE&connect_redirect=1#wechat_redirect`;
    //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4a123d5017f9e248&redirect_uri=http%3A%2F%2Fleeandfly.wicp.net%2Fweixin&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect


    const html = htmlTemplate({
        title: '微信鉴权引导',
        content: `<a href="${url}">跳转到鉴权页面</a>`
    }, res);
    res.send(html);
});


/*app.get('/weixin', function(req, res) {
    fs.readFile('./public/weixin/weixin.html', 'utf-8', function(err, data) {
        if (err) {
            res.send('页面读取错误');
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.send(data);

        }
    });
});*/



app.listen(port, hostName, function() {

    console.log(`服务器运行在http://${hostName}:${port}`);

});