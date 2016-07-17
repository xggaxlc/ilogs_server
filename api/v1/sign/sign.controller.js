/**
 * POST    /             ->  signin
 */

'use strict';

const _ = require('lodash');
const Q = require('q');
const validator = require('validator');
const User = require('../user/user.model');
const Utils = require('../../../components/utils.js');
const Token = require('../../../components/token');

function checkEmpty(userInfo) {
  return Q.fcall(() => {
    if (!userInfo.account_name) return Q.reject({
      message: '账户名必填'
    });
    if (!userInfo.password) return Q.reject({
      message: '密码必填'
    });
    return userInfo;
  });
}

function createCondition() {
  return userInfo => {
    return Q.fcall(() => {
      let condition = validator.isEmail(userInfo.account_name) ? {
        email: userInfo.account_name
      } : {
        name: userInfo.account_name
      };
      return [condition, userInfo];
    });
  }
}

function findUser() {
  return (condition, userInfo) => {
    return User.findOne(condition)
      .populate('role')
      .exec()
      .then(entity => {
        if (!entity) return Q.reject({
          message: '账户不存在'
        });
        return [entity, userInfo];
      });
  }
}

function checkPass() {
  return (entity, userInfo) => {
    return Q.fcall(() => {
      if (Utils.cryptoPass(userInfo.password) != entity.password) return Q.reject({
        message: '密码错误'
      });
      return entity;
    });
  }
}

function createToken() {
  return entity => {
    return Q.fcall(() => {
      return [Token.createToken(entity), entity];
    });
  }
}

function updateLastLogin() {
  return entity => {
    return User.findOneAndUpdate({
        _id: entity._id
      }, {
        last_login_at: new Date()
      })
      .populate('role');
  }
}

exports.signin = function(req, res) {
  checkEmpty(req.body)
    .then(createCondition())
    .spread(findUser())
    .spread(checkPass())
    .then(updateLastLogin())
    .then(createToken())
    .spread((token, entity) => {
      res.status(200).json({
        token: token,
        user: entity
      });
    })
    .catch(err => {
      res.status(400).json(_.merge({
        success: 0
      }, err));
    });
}