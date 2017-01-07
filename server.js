'use strict'

var express = require('express');



var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var formidable = require('express-formidable');
var session = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);



app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(formidable());
//app.use(upload.single('random'));

app.use(session({secret: 'ilovenodejs'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);
require('./app/routes')(app,passport);

app.listen(port);
console.log('Up and running on port: ' + port);