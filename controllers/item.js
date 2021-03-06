var moment = require('moment');
var mongoose = require('mongoose');

var Item = require('../models/Item');

exports.postItems = function(req, res) {
    var listId = req.param("listId");
    var words = req.body.words;
    var items = [];
    if (words == undefined) {
        return res.status(400).json({msg: "Make sure the format of request"});
    }
    for (var i = 0; i < words.length; i++) {
        var item = new Item({
            _id: "",
            word: words[i].toString(),
            listId: listId,
            createdDate: moment().unix()
        });
        item._id = item.listId + "_" + item.word;
        items[i] = item;
    }
    console.log(items.length);

    Item.create(items, function(err, result) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    return res.status(409).json([{
                        msg: 'Some words is existing'
                    }]);
                    break;
                default:
                    var modelErrors = [];
                    if (err.errors) {
                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }
                        return res.status(400).json(modelErrors);
                    }
            }
            return res.status(500).json({msg: err.message});
        }
        return res.status(200).json({msg: "List words inserted"});
    });
}

exports.getItems = function(req, res) {
    var listId = req.param("listId");
    Item.find({listId: listId}, function(err, items) {
        if (err) {
            switch (err.code) {
                default:
                    var modelErrors = [];
                    if (err.errors) {
                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }
                        return res.status(400).json(modelErrors);
                    }
            }
            return res.status(500).json({msg: err.message});
        }
        return res.status(200).json({words: items});
    })
}

exports.deleteItem = function(req, res) {
    var listId = req.param("listId");
    var word = req.param("word");
    if (word === undefined) {
        return res.status(400).json({msg: "Bad request"});
    }
    Item.findOne({listId: listId, word: word}, function(err, item) {
        if (err) {
            switch (err.code) {
                default:
                    var modelErrors = [];
                    if (err.errors) {
                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }
                        return res.status(400).json(modelErrors);
                    }
            }
            return res.status(500).json({msg: err.message});
        }
        if (item == undefined) return res.status(404).json({msg: "Word not found"});
        item.remove(function (err, item) {
            if (err) {
                return res.status(500).json({msg: err.message});
            } else {
                return res.status(200).json({msg: "Word deleted"})
            }
        });
    })
}