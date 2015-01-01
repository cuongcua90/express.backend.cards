var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    _id: String,
    word: {type: String, lowercase: true},
    listId: String,
    createdDate: Date
});

module.exports = mongoose.model('Item', itemSchema);