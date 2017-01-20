var mongoose = require('mongoose');


var businessSchema = mongoose.Schema({
    name: String,
    category: Number,
    rating: Number,
    verified: Boolean,
    featuredInSearch: Boolean,
    featuredInCategory: Boolean,
    banner: String,
    logo: String,
    photos: [String],
    reviews: [{type:mongoose.Schema.Types.ObjectId,ref:"Review"}],
    //subCategory: [String], not needed
    tags: [String],
    coordinates: [Number],
    address: String,
    info: String,
    contact: String,
    website: String
});

module.exports = mongoose.model('Business',businessSchema);