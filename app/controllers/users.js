var User = require('../models/user');
var Business = require('../models/business');
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
        if (err) {
            res.status(400).send(err);
        }
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
    console.log(req.body.email);
    console.log(req.body.password);
    if (!req.body.email || !req.body.password) {
        return res.status(400).send("Invalid parameters");
    }
    User.findOne({'local.email':req.body.email},function(err,user){
        if (err)
            res.status(400).send("error");
        if (user) {
            if (!user.validPassword(req.body.password)) {
                res.status(401).json({status: 0, message: "Invalid Password"});
            } else {
                console.log('user id');
                console.log(user._id);
                var token = jwt.sign(user._id, secret, {
                    expiresIn: '24h' // expires in 24 hours
                });
                res.status(200).json({status: 1, message: "Logged in!", token: token});

            }
        } else {
            res.status(404).json({status:0, message: "Email doesn't exist"});
        }
    })
};
//User Profile
module.exports.profile = function(req,res,next){
    var userID = req.decoded.id;

    User.findOne({_id:userID},function(err,obj){
        if (err)
            res.status(400).send("error");
        if (obj)
            res.status(200).json(obj);
    });
};
//User favourites
module.exports.favourites = function(req,res,next){
    var userID = req.decoded.id;

    User
        .findOne({_id:userID})
        .populate('favourites')
        .exec(function (err, user) {
            if (err) return handleError(err);
            console.log('The count of favourites is %s', user.local.favourites);
            res.status(200).json(user.local.favourites);

        });

};

//favourite a business
//In Progress, to be contined after "Add a business"
module.exports.favourite = function(req,res,next){

     var userID = req.decoded.id;
     var businessID = req.params.businessID;

     User.findById(userID, function(err,user){
        if (err)
            res.status(400).send("error");
        if (user) {
            user.local.favourite.push(businessID);
            res.status(200).json({status:1, message:"Favourited!"});
        }

     })
};



module.exports.addbusiness = function(req,res,next) {

    console.log("Add a business");


    console.log(req.files.length);
    console.log(req.body.tags.length <= 6);

    if (!req.body.name || !req.body.category || !req.body.address || !req.body.email || !req.body.contact ||
        !req.body.website || !req.body.info || !req.body.verified || !req.body.featuredInSearch ||
        !req.body.featuredInCategory || !(req.body.tags.length >= 2 && req.body.tags.length <= 6) ||
        !(req.files.length == 2)) {

        return res.status(400).send("Invalid Parameters");
    }

    Business.findOne({'name':req.body.name}, function(err,business){
        if (err) {
            res.status(400).send(err);
        }

        if (business) {
            res.status(400).send('A business already exists with this name')
        }

        var newBusiness = new Business();
        newBusiness.name = req.body.name;
        newBusiness.category = req.body.category;
        newBusiness.address = req.body.address;
        newBusiness.contact = req.body.contact;
        newBusiness.website = req.body.website;
        newBusiness.info = req.body.info;
        newBusiness.verified = req.body.verified;
        newBusiness.featuredInSearch = req.body.featuredInSearch;
        newBusiness.featuredInCategory = req.body.featuredInCategory;
        newBusiness.tags = req.body.tags;
        newBusiness.coordinates = req.body.coordinates;


        imageUploader.upload(req.files[0].path, req.body.email + '/logo').then(function (result){
            newBusiness.logo = result.url;

            console.log('In first block');
            imageUploader.upload(req.files[1].path, req.body.email + '/' +
                'banner').then(function (result){
                newBusiness.banner = result.url;
                console.log(newBusiness);
                newBusiness.save(function(err) {
                        if (err) {
                           res.status(400).send(err);
                        }
                    }
                ).then(function (business) {


                    console.log('In Save');
                    business = business.toObject();

                    delete business.__v;

                    res.status(200).send(JSON.stringify(business));
                })

            }).catch(function(error) {

                res.status(400).send(error);
            })

        }).catch(function(error) {
            console.log('this4');

            res.status(400).send(error);
        })

    })
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
