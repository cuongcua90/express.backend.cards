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


/*
 * Controllers
 */
var userController = require('./controllers/user');


var app = express();
app.use(bodyParser());

/**
 * Main routes
 */
app.get('/', homeController.index);
app.post('/login', userController.postLogin);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.post('/reset/:token', userController.postReset);
app.post('/signup', userController.postSignup);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);


app.listen(3000, function() {
	console.log('Listeing on port 3000 ....');
});

module.exports = app;
