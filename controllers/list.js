var moment = require('moment');

var List = require('../models/List');

/**
 * POST /lists
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.postLists = function(req, res) {
    console.log("" + req.body.title);
    req.assert('title', 'Title must not empty').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).json(errors);
    }

    var list = new List ({
        title: req.body.title,
        description: req.body.description,
        image: null,
        creator: req.user,
        createdDate: moment().unix()
    });

    list.save(function(err) {
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
        return res.status(200).json({msg: 'list created  success'});
    });
}

exports.getLists = function(req, res, next) {
    List.find({creator: req.user}, function(err, lists) {
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
        return res.status(200).json({lists: lists});
    });
}

exports.deleteLists = function(req, res, next) {
    var listId = req.param("listId");
    List.findById(listId, function(err, list) {
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

        if (list == null) return res.status(404).json({msg: "List not found"});

        if (req.user != list.creator) {
            return res.status(403).json({msg: "You do not have this permission"});
        }

        list.remove(function (err, list) {
            if (err) {
               return res.status(500).json({});
            }

            return res.status(200).json({msg: "List deleted"});
        })

    })
}

