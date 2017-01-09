var mongoose = require('mongoose');

var businessSchema = mongoose.Schema({
    name: String,
    rating: Number,
    verified: Boolean,
    banner: String,
    logo: String,
    photos: [],
    reviews: [],
    subCategory: [],
    location: [],
    address: String,
    info: String,
    contact: String,
    website: String

});

module.exports = mongoose.model('Business',businessSchema);