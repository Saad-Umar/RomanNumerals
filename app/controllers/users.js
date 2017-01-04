var User = require('../models/user');
var passport = require('passport');

module.exports = {};

//User Creation
module.exports.create = function(req,res) {
    console.log('In create');
    if (!req.body.email || !req.body.password ) {
        return res.status(400).end('Invalid parameters');
    }

    User.findOne({'local.email': req.body.email}, function(err,user) {
        if (user) {
            return res.status(400).end('User already exists');
        } else {

            var newUser = new User();
            newUser.local.email = req.body.email;
            newUser.local.password = newUser.generateHash(req.body.password);
            newUser.save();

            res.writeHead(200,{"Content-Type":"application/json"});

            newUser = newUser.toObject();
            delete newUser.local.password;
            res.end(JSON.stringify(newUser));
        }
    })
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