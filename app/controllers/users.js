var User = require('../models/user');
var passport = require('passport');
var imageUploader = require('../../image-uploader');

module.exports = {};

//User Creation

module.exports.check = function(req,res) {
    if (!req.params.emailID) {
        res.status(400).send('Invalid parameters');
    }

    User.findOne({'local.email':req.params.emailID}, function(err,user){
        if (user){
            return res.status(400).send('User already exists');
        } else {
            return res.status(200).send('Email available');
        }
    });
};

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

                    user = user.toObject();
                    delete user.local.password;
                    res.status(200).send(JSON.stringify(user));
                })

            }).catch(function(error) {
                console.log('this4');

                res.status(400).send("ERROR");
            })
        }
    });
};
module.exports.login = function(req,res,next){
    console.log('In Users login1');
    passport.authenticate('local-login',function(err, user, info) {
        console.log('In Users login2');
        if (err)
            return next(err);
        if (!user)
            return res.status(400).json({SERVER_RESPONSE: 0, SERVER_MESSAGE:"Invalid Credentials"});
        req.login(user, function(err){
            if (err)
                return next(err);
            if (!err)
                return res.json({ SERVER_RESPONSE: 1, SERVER_MESSAGE: "Logged in!" });
        });
    })(req,res,next);
};