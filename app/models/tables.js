var mongoose = require('mongoose');

var tableSchema = new mongoose.Schema({
    userID: String,
    originalname: String,
    encoding: String,
    mimeptype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    created_at: Date,
    updated_at: Date
});

var Table = mongoose.model('Table', tableSchema);

module.exports = Table;