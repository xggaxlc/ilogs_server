'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const Q = require('q');
const SECRETKEY = config.secrets.jwt;

exports.createToken = function(user) {
  let payload = {
    _id: user._id
  };
  let options = {
    expiresIn: config.tokenExpires
  };

  var deferred = Q.defer();

  jwt.sign(payload, SECRETKEY, options, (err, token) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(token);
    }
  });

  return deferred.promise;
}

exports.vertifyToken = function(token) {
  let options = {
    ignoreExpiration: false
  };

  var deferred = Q.defer();

  jwt.verify(token, SECRETKEY, options, (err, decoded) => {
    if (err) {
      deferred.reject({
        statusCode: 401,
        message: 'token无效或者已经过期！'
      });
    } else {
      deferred.resolve(decoded);
    }
  });

  return deferred.promise;

}