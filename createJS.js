const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const hostName = require('./lib/getIPAdress');
const port = 8997;
const pathname = '/createJS';

app.get(pathname, function(req, res) {

    
    const js =
    `const test = function() {
        alert('test');
    }
    test();
    `;

    res.setHeader('Content-Type', 'text/javascript');
    res.send(js);
});


app.listen(port, hostName, function() {

    console.log(`服务器运行在http://${hostName}:${port}`);

});
