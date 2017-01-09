var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local : {
        name: String,
        photo: String,
        email : String,
        password : String,
        gender: String,
        city: String,
        country: String
    },
    facebook : {
        id : String,
        token : String,
        email : String,
        name : String
    },
    google : {
        id : String,
        token : String,
        email : String,
        name : String
    }
});

// Generate Hash for the password

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Is the password valid

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User',userSchema);