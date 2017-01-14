var mongoose = require('mongoose');


var businessSchema = mongoose.Schema({
    name: String,
    rating: Number,
    verified: Boolean,
    banner: String,
    logo: String,
    photos: [String],
    reviews: [{type:String,ref:"Review"}],
    subCategory: [String],
    coordinates: {lat:String,long:String},
    address: String,
    info: String,
    contact: String,
    website: String
});

module.exports.model = mongoose.model('Business',businessSchema);