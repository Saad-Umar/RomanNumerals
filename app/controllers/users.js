var User = require('../models/user');
var passport = require('passport');
var imageUploader = require('../../image-uploader');
var jwt = require('jsonwebtoken');
var secret = require('../../config/auth').jsonSecret;


module.exports = {};


//Important: Correct all status codes and responses.

//Email Availability Check
module.exports.check = function(req,res) {
    if (!req.params.emailID) {
        res.status(400).send('Invalid parameters');
    }

    User.findOne({'local.email':req.params.emailID}, function(err,user){
        if (user){
            return res.status(200).send({'status':1,'message':'user already exists'});
        } else {
            return res.status(200).send({'status':0,'message':'email available'});
        }
    });
};
//User Creation
module.exports.create = function(req,res,next) {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.gender || !req.body.city || !req.file) {
        console.log('this1');

        res.status(400).send('Invalid parameters');
    }

    User.findOne({'local.email': req.body.email}, function(err,user) {
        console.log('this2');
        if (user) {
            console.log('this3');

            return res.status(400).send('User already exists');
        } else {

            console.log('this');

            var newUser = new User();
            newUser.local.name = req.body.name;
            //newUser.local.photo = req.body.photo;
            newUser.local.email = req.body.email;
            newUser.local.password = newUser.generateHash(req.body.password);



            imageUploader.upload(req.file.path, req.body.email).then(function (result){
                newUser.local.photo = result.url;
                newUser.save().then(function (user) {
                    //res.writeHead(200,{"Content-Type":"multipart/form-data"});
                    console.log('I am here');

                    user = user.toObject();


                    var token = jwt.sign(user._id, secret, {
                        expiresIn: 60*60*24 // expires in 24 hours
                    });

                    delete user.local.password;
                    delete user.__v;
                    delete user._id;


                    user.local["token"] = token;
                    res.status(200).send(JSON.stringify(user));
                })

            }).catch(function(error) {
                console.log('this4');

                res.status(400).send("error");
            })
        }
    });
};
//User Login
module.exports.login = function(req,res,next){
    console.log('In Users login1');
    //Removing Passport
    // passport.authenticate('local-login',function(err, user, info) {
    //     console.log(info);
    //     console.log(err);
    //     console.log(user);
    //     console.log('In Users login2');
    //     if (err)
    //         return next(err);
    //     if (!user)
    //         return res.status(400).json({status: 0, message: "Invalid Credentials"});
    //     req.login(user, function(err){
    //         if (err)
    //             return next(err);
    //         if (!err)
    //             var token = generateToken(user._id);
    //             return res.json({ status: 1, message: "Logged in!",token: token });
    //     });
    // })(req,res,next);
    console.log(req.body.email);
    console.log(req.body.password);
    if (!req.body.email || !req.body.password) {
        return res.status(400).send("Invalid parameters");
    }
    User.findOne({'local.email':'email'},function(err,user){
        console.log('Start');
        console.log(user);
        console.log(err);
        console.log('End');
        if (err)
            res.status(400).send("error");
        if (!user.validPassword('password')) {
            res.status(401).json({status:0, message:"Invalid Password"});
        } else {
            var token = jwt.sign(user._id, secret, {
                expiresIn: 60*60*24 // expires in 24 hours
            });
            res.status(200).json({status:0, message:"Logged in!", token: token});

        }
    })
};
//User Profile
module.exports.profile = function(req,res,next){
    var userID = req.decoded._id;
    var ObjectID = require('mongodb').ObjectID;
    var obj_ID = new ObjectID("'"+userID+"'");

    User.findOne({_id:obj_ID},function(err,obj){
        res.status(200).json(obj);
    });
};
//User favourites
module.exports.favourites = function(req,res,next){
    var userID = req.decoded._id;
    var ObjectID = require('mongodb').ObjectID;
    var obj_ID = new ObjectID("'"+userID+"'");

    User
        .findOne({_id:obj_ID})
        .populate('favourites')
        .exec(function (err, favourites) {
            if (err) return handleError(err);
            console.log('The count of favourites is %s', user.favourites.count);
            res.status(200).json(favourites);

        });

};
//favourite a business
module.exports.favourite = function(req,res,next){

};
//Helpers in one place, later dude later....
//
// module.exports.generateToken = function(user){
//     //User Creation
//     // create a token
//         console.log('tada');
//
//     return token;
// };
