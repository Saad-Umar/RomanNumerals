var LocalStrategy = require('passport-local').Strategy;


var User = require('../app/models/user');


module.exports = function(passport) {

    passport.serializeUser(function(user,done) {
        done(null,user.id);
    });

    passport.deserializeUser(function(id,done){
        User.findById(id, function(err,user){
            done(err,user);
        });
    });

    //Local SignUp

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req,email,password,done) {
        console.log('Im here');
        process.nextTick(function(){
            User.findOne({'local.email' : email}, function(err,user){

                if (err)

                    return done(err);
                if (user) {
                    return done(null,false)
                } else {
                    var newUser = new User();

                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err){
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));



    //Local Login
    passport.use('local-login', new LocalStrategy({

        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req,email,password,done) {
        console.log('in passport');
        User.findOne({'local.email': email}, function (err, user) {

            if (err)
                return done(err);

            if (!user)
                return done(null, false);

            return done(null, user);
        });
    }));
};