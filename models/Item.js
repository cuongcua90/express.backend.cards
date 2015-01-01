var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    word: {type: String, lowercase: true},
    listId: String,
    createdDate: Date
});

module.exports = mongoose.model('Item', itemSchema);