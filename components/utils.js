'use strict';

const Q = require('q');
const crypto = require('crypto');
const config = require('../config/environment');

exports.ValidateError = class ValidateError extends Error {
  constructor(msg) {
    super();
    this.type = 'validateError';
    this.message = msg;
  }
}

exports.checkPass = function(pass) {
  let deferred = Q.defer();
  //不一定会更新password字段
  if (!pass) {
    deferred.resolve();
    return deferred.promise;
  }
  if (pass.length >= 6 && pass.length <= 16) {
    deferred.resolve(exports.cryptoPass(pass));
  } else {
    deferred.reject({
      statusCode: 200,
      message: '密码 必须是 6 - 16 个字符'
    });
  }
  return deferred.promise;
}

exports.cryptoPass = function(pass) {
  if (pass) return crypto.createHmac('sha1', config.secrets.sha1).update(pass).digest('hex');
}