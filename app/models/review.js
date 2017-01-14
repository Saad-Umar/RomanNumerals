var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');



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
    postedBy: {type:String,ref:"User"},
    postedOn: {type:String,ref:"Business"}
});

module.exports = mongoose.model('Review', reviewSchema);
