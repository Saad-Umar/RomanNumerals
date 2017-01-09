var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var User = require('./user');
var Business = require('./business');

var reviewSchema = mongoose.Schema({

    //rating
    //Agree Disagree
    //content
    //time
    //postedBy
    //reviewedOn
    rating: Number,
    agree: Number,
    disagree: Number,
    content: String,
    time: Date,
    postedBy: User,
    postedOn: Business
});

module.exports = mongoose.model('Review', reviewSchema);