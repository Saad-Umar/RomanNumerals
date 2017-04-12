var users = require('./controllers/users');
var express = require('express');
var middlewares = require('../image-uploader').middlewares;
var jwt = require('jsonwebtoken');
var secret = require('../config/auth').jsonSecret;
var multer = require('multer');
var Table = require('./models/tables');
//Important: Change methods to their accurate variants

module.exports = function(app, passport) {

    //For New Relic
    app.get('/', function(req,res) {
        return res.status(200).send("Server is up!");
    });
    app.get('/checkemail/:emailID',users.check);
    app.post('/signup',middlewares.photo, users.create);
    app.post('/login',middlewares.single,users.login);
    app.get('/userprofile',authenticateRequest,users.profile);
    app.get('/userfavourites',authenticateRequest, users.favourites);
    app.get('/userfavourites/:businessID',authenticateRequest,users.favourite);

    app.post('/businesslist',authenticateRequest,middlewares.single,users.businesslist);


    //Doesn't belong here, BAT
    //app.post('/uploadtables',middlewares.csv,users.uploadtables);
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var originalname = file.originalname;
            var extension = originalname.split(".");
            filename = Date.now() + '.' + extension[extension.length-1];
            cb(null, filename);
        }
    });
    app.post('/uploadtables', multer({storage: storage, dest: './uploads/'}).single('uploads'), function(req,res){
        var table = new Table ({
            userID: req.body.userID,
            originalname: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            destination:req.file.destination,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size
        })
        table.save(function(err){
            if (err){
                return res.status(400).send(err);
            }
            else {
                return res.status(200).send('Table saved successfully, dude.');
            }
        })
    });

    app.get('/table/:userid', function(req,res) {
        if (!req.params.userid) {
            res.status(400).send('Invalid parameters');
        }
        Table.findOne({'userID':req.params.userid}, function (err,table) {
          if (table) {
              return res.status(200).send({'table':table});
          }  else {
              return res.status(200).send('Not found');
          }
        });
    });

    //Admin side
    app.post('/adminsignup');
    app.post('/adminlogin');
    //To be changed
    app.post('/addbusiness',authenticateRequest,middlewares.photos,users.addbusiness);

    app.delete('/deletebusiness/:businessID',authenticateRequest,users.deletebusiness);
    //app.post('',authenticateRequest);

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