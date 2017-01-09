var users = require('./controllers/users');
var express = require('express');
var middlewares = require('../image-uploader').middlewares;
var jwt = require('jsonwebtoken');
var secret = require('../config/auth').jsonSecret;

module.exports = function(app, passport) {

    app.get('/checkemail/:emailID',users.check);
    app.post('/signup',middlewares.photo, users.create);
    app.post('/login',users.login);
    app.get('/userprofile/:userID',authenticateRequest,users.profile);
    //app.post('/newsfeed',..);
    //app.post('/search',)
    //app.get('/businessList',);

    function authenticateRequest(req,res,next){
        var token = req.headers['x-access-token'];

        if (token){
            jwt.verify(token, secret ,function(err,decoded){
                if (err){
                    return res.status(401).json({success: false, message: 'Failed to authenticate token'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }

};