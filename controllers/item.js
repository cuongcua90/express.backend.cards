var moment = require('moment');

var List = require('../models/List');
var Item = require('../models/Item');

exports.postItems = function(req, res) {
    var listId = req.param("listId");
    var words = req.body.words;
    var items = [];
    for (var i = 0; i < words.length; i++) {
        var item = new Item({
            word: words[i],
            listId: listId,
            createdDate: moment().unix()
        });
        items[i] = item;
    }
    console.log(items.length);
    Item.collection.insert(items, null, function(err, items) {
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
        }
        return res.status(200).json({words: items});
    })
}