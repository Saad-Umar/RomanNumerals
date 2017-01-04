var users = require('./controllers/users');
var express = require('express');

module.exports = function(app, passport) {

    app.post('/signup',users.create);

    app.post('/login',users.login);

};