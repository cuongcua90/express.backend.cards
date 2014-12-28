var mongoose = require('mongoose');

var listSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    creator: String,
    createdDate: String
});

module.exports = mongoose.model('List', listSchema);