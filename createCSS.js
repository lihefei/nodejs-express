const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const hostName = require('./lib/getIPAdress');
const port = 8998;
const pathname = '/createCSS';

app.get(pathname, function(req, res) {

    
    const css = `header {
		background-color: red;
	}

	main {
		background-color: yellow;
	}

	footer {
		background-color: green;
	}`;

    res.setHeader('Content-Type', 'text/css');
    res.send(css);
});


app.listen(port, hostName, function() {

    console.log(`服务器运行在http://${hostName}:${port}`);

});
