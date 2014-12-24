var _ = require('underscore');
var secrets = require('../config/secrets');

/**
 * POST /Login
 */

exports.login = function(req, res, next) {
  res.send('login');
};


/**
 * POST /signup
 */

exports.signup = function(req, res, next) {
  res.send('signup');
};


/**
 * POST /account/profile
 * Update profile information.
 */

exports.updateProfile = function(req, res, next) {
  res.send('update profile');
};

/**
 * POST /account/password
 * Update current password.
 */

exports.updatePassword = function(req, res, next) {
  res.send('update password');
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 * @param email
 */

exports.forgot = function(req, res, next) {
  res.send('forgot');
};
