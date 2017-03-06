var mongoose = require('mongoose');


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
    postedBy: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    postedOn: {type:mongoose.Schema.Types.ObjectId,ref:"Business"}
});

module.exports = mongoose.model('Review', reviewSchema);
