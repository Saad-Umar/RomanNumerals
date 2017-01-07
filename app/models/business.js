var mongoose = require('mongoose');

var businessSchema = mongoose.Schema({
    name: String,
    rating: Number,
    verified: Boolean,
    //banner: Photo,
    //photos: [Photo],
    //reviews: [Review],
    //sub-category: [],
    //location: lat, long,
    //info: String,
    //contact: String,
    //website: String,

});