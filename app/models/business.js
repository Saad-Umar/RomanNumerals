var mongoose = require('mongoose');


var businessSchema = mongoose.Schema({
    name: String,
    category: Number,
    rating: Number,
    verified: Boolean,
    banner: String,
    logo: String,
    photos: [String],
    reviews: [{type:mongoose.Schema.Types.ObjectId,ref:"Review"}],
    subCategory: [String],
    coordinates: {lat:String,long:String},
    address: String,
    info: String,
    contact: String,
    website: String
});

module.exports = mongoose.model('Business',businessSchema);