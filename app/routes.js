var users = require('./controllers/users');
var express = require('express');
var middlewares = require('../image-uploader').middlewares;


module.exports = function(app, passport) {

    app.get('/checkemail/:emailID',users.check);
    app.post('/signup',middlewares.photo, users.create);
    app.post('/login',users.login);
    //app.post('/newsfeed',..);
    //app.post('/search',)
    //app.get('/businessList',);

};