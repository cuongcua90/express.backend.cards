var _ = require('underscore');
var secrets = require('../config/secrets');
var User = require('../models/User');

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
  console.log(req.body);
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    return res.status(401).send(errors);
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(404).send('Account is exist');
    }
    user.save(function(err) {
      if (err) return next(err);
      return res.status(200).send('Create success');
    });
  });
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
