/**
 * POST    /signin             ->  signin
 * POST    /signup             ->  signup
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
        email: validator.trim(userInfo.account_name.toLowerCase())
      } : {
        name: validator.trim(userInfo.account_name)
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
    return Token.createToken(entity)
      .then(token => {
        return [token, entity];
      });
  }
}

function updateLastLogin() {
  return entity => {
    return User.findOneAndUpdate({
        _id: entity._id
      }, {
        last_login_at: new Date()
      }, {
        new: true
      })
      .populate('role');
  }
}

function createMasterUser(userInfo) {
  userInfo.master = true;
  return Q.fcall(() => {
      if (!userInfo.name || !userInfo.password) {
        return Q.reject({
          message: '用户名和密码必填!'
        });
      }
    })
    .then(() => {
      return Utils.checkPass(userInfo.password);
    })
    .then(hashedPass => {
      if (hashedPass) {
        userInfo.password = hashedPass;
      };
      return userInfo;
    })
    .then(userInfo => {
      let masterUser = new User(userInfo);
      //不执行validate验证
      return masterUser.save({
        validateBeforeSave: false
      });
    });
}

function createCommonUser(userInfo) {
  // delete userInfo.master;
  // return Utils.checkPass(userInfo.password)
  //   .then(hashedPass => {
  //     if (hashedPass) return userInfo.password = hashedPass;
  //   })
  //   .then(userInfo => {
  //     let newUser = new User(userInfo);
  //     return newUser.save();
  //   });
  return Q.reject({
    message: '暂不支持注册！'
  });
}

exports.signin = function(req, res) {
  checkEmpty(req.body)
    .then(createCondition())
    .spread(findUser())
    .spread(checkPass())
    .then(updateLastLogin())
    .then(createToken())
    .spread((token, entity) => {
      res.json({
        success: 1,
        token: token,
        user: entity
      });
    })
    .catch(err => {
      res.json(_.merge({
        success: 0
      }, err));
    });
}

exports.signup = function(req, res) {
  User.count().exec()
    .then(count => {
      return count ? createCommonUser(req.body) : createMasterUser(req.body);
    })
    // 注册成功自动登录
    .then(updateLastLogin())
    .then(createToken())
    .spread((token, entity) => {
      res.json({
        success: 1,
        token: token,
        user: entity
      });
    })
    .catch(err => {
      res.json(_.merge({
        success: 0
      }, err));
    });
}