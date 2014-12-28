var _ = require('underscore');
var moment = require('moment');
var jwt = require('jwt-simple');
var request = require('request');
var logger = require('morgan');

var secrets = require('../config/secrets');
var User = require('../models/User');


/**
 * Authenticated
 */

exports.authenticated = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, secrets.TOKEN_SECRET);
  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
};


/**
 * create token
 */

function createToken(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, secrets.TOKEN_SECRET);
}



/**
 * POST /Login
 */

exports.login = function(req, res, next) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (!user) {
      return res.status(401).json([{ msg: 'Wrong email or password' }]);
    }

    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).json([{ msg: 'Wrong email or password' }]);
      }
      res.json({ token: createToken(user) });
    });
  });
};


/**
 * POST /signup
 */

exports.signup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).json(errors);
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
          return res.status(409).json([{
            msg: 'email already taken',
            param: 'email',
            value: req.body.email
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
    }
    return res.status(200).json({msg: 'user created  success'});
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
