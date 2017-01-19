var users = require('./controllers/users');
var express = require('express');
var middlewares = require('../image-uploader').middlewares;
var jwt = require('jsonwebtoken');
var secret = require('../config/auth').jsonSecret;



module.exports = function(app, passport) {

    app.get('/checkemail/:emailID',users.check);
    app.post('/signup',middlewares.photo, users.create);
    app.post('/login',middlewares.single,users.login);
    app.get('/userprofile',authenticateRequest,users.profile);
    app.get('/userfavourites',authenticateRequest, users.favourites);
    app.get('/userfavourites/:businessID',authenticateRequest,users.favourite);

    //To be changed
    app.post('/addbusiness',middlewares.photos,users.addbusiness);

    //app.post('/newsfeed',..);
    //app.post('/search',);
    //app.get('/businessList',);
    //app.get('/featureBusiness/:businessID',); //Limit - 2, rest in pipeline, expiry
    //app.get('/removeFeaturedBusiness/:businessID',);
    //app.get('/categoryFeatureBusiness/:businessID',); //Limit - 1, rest in pipeline, expiry
    //app.get('/removeFeatureBusiness/:businessID',);



    function authenticateRequest(req,res,next){
        var token = req.headers['x-access-token'];
        console.log("Token");
        console.log(token);

        console.log('authenticate secret');
        console.log(secret);

        if (token){
            jwt.verify(token, secret ,function(err,decoded){
                if (err){
                    console.log(err);
                    return res.status(401).json({success: false, message: 'Failed to authenticate token'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }

};