var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    word: String
});

module.exports = mongoose.model('Item', itemSchema);