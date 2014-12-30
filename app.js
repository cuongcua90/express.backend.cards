'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();

var _ = require('underscore');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');

/** 
 * Express Api and secret
 */
var secrets = require('./config/secrets');

/*
 * Controllers
 */
//var userController = require('./controllers/user');


var app = express();

/**
 * Controllers (route handlers).
 */
var userController = require('./controllers/user');
var listController = require('./controllers/list');
var itemController = require('./controllers/item');

/**
 * Connect to mongodb
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

/**
 * Express configuration
 */
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
/**
 * Main routes
 */
app.post('/login', userController.login);
app.post('/forgot', userController.forgot);
app.post('/signup', userController.signup);
app.post('/lists', userController.authenticated, listController.postLists);
app.post('/items/:listId', userController.authenticated, listController.checkPermission, itemController.postItems);

app.get('/lists', userController.authenticated, listController.getLists);
app.get('/items/:listId', userController.authenticated, listController.checkPermission, itemController.getItems);

app.delete('/lists/:listId', userController.authenticated, listController.deleteLists);
app.delete('/items/:listId', userController.authenticated, itemController.deleteItems);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
