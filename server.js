'use strict'


var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

require('./app/routes')(app);

app.listen(port);
console.log('Up and running on port: ' + port);