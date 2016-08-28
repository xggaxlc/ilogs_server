/**
 * POST    /signin             ->  signin
 * POST    /signup             ->  signup
 * POST    /resetPass             ->  applyResetPass
 * PUT     /resetPass             ->  resetPass
 */

'use strict';

const Q = require('q');
const uuid = require('uuid');
const validator = require('validator');
const User = require('../user/user.model');
const Setting = require('../setting/setting.model');
const Utils = require('../../../components/utils');
const Token = require('../../../components/token');
const Respond = require('../../../components/respond');
const Mailer = require('../../../components/mail');

function checkEmpty(userInfo) {
  return Q.fcall(() => {
    if (!userInfo.account_name) return Q.reject({
      statusCode: 200,
      message: '账户名必填'
    });
    if (!userInfo.password) return Q.reject({
      statusCode: 200,
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
          statusCode: 200,
          message: '账户不存在'
        });

        if (!entity.active) return Q.reject({
          statusCode: 200,
          message: '账号已经被锁定'
        });

        return [entity, userInfo];
      });
  }
}

function checkPass() {
  return (entity, userInfo) => {
    return Q.fcall(() => {
      if (Utils.cryptoPass(userInfo.password) != entity.password) return Q.reject({
        statusCode: 200,
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
        last_login_at: new Date(),
        changed: false
      }, {
        new: true
      })
      .populate('role');
  }
}

function createMasterUser(userInfo) {
  userInfo.master = true;
  return Utils.checkPass(userInfo.password)
    .then(hashedPass => {
      if (hashedPass) {
        userInfo.password = hashedPass;
      }
      return userInfo;
    })
    .then(userInfo => {
      let masterUser = new User(userInfo);
      return masterUser.save();
    });
}

function createCommonUser(userInfo) {
  delete userInfo.master;

  return Q.fcall(() => {
      // retrieve_key 是否存在
      if (!userInfo.key) return Q.reject({
        statusCode: 403,
        message: '无效的注册链接'
      });
      return validator.trim(userInfo.key);
    })
    .then(key => {
      // 数据库找retrieve_key
      return User.findOne({
        retrieve_key: key
      });
    })
    .then(user => {
      // 不合法的retrieve_key
      if (!user) return Q.reject({
        statusCode: 403,
        message: '无效的注册链接'
      });
      return user;
    })
    .then(user => {
      // 检查key的expire时间
      let now = new Date().getTime();
      if (now > user.retrieve_time) return Q.reject({
        statusCode: 403,
        message: '注册链接已经过期'
      });
      return [user, Utils.checkPass(userInfo.password)];
    })
    .spread((user, hashedPass) => {
      user.set(userInfo);
      user.password = hashedPass;
      user.active = true;
      user.retrieve_key = null;
      user.retrieve_time = null;
      return user.save();
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
      let user = entity.toObject();
      delete user.password;
      res.json({
        success: 1,
        token: token,
        user: user
      });
    })
    .catch(Respond.handleError(res));
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
      let user = entity.toObject();
      delete user.password;
      res.json({
        success: 1,
        token: token,
        user: user
      });
    })
    .catch(Respond.handleError(res));
}

// 申请重置密码
exports.applyResetPass = function(req, res) {
  Q.fcall(() => {
      let email = req.body.email;
      if (!email) return Q.reject({
        statusCode: 200,
        message: '邮箱必填!'
      });
      return validator.trim(email).toLowerCase();
    })
    .then(email => {
      if (!validator.isEmail(email)) return Q.reject({
        statusCode: 200,
        message: '邮箱格式不正确'
      });
      return User.findOne({
        email: email
      }).exec();
    })
    .then(user => {
      if (!user) return Q.reject({
        statusCode: 200,
        message: '账号不存在'
      });
      return user;
    })
    .then(user => {
      return [Setting.find().exec(), user];
    })
    .spread((setting, user) => {
      setting = setting[0] || [];
      if (!setting.resetpass_link) return Q.reject({
        statusCode: 200,
        message: '需要设置重置密码链接'
      });
      if (!setting.resetpass_expire) return Q.reject({
        statusCode: 200,
        message: '需要设置重置密码过期时间'
      });

      let retrieveKey = uuid.v4();
      // retrieveKey过期时间
      let retrieveTime = new Date().getTime() + Number(setting.resetpass_expire) * 24 * 60 * 60 * 1000;

      user.retrieve_key = retrieveKey;
      user.retrieve_time = retrieveTime;

      return [user.save(), setting];
    })
    .spread((user, setting) => {
      let resetPassLink = `${setting.resetpass_link}?key=${user.retrieve_key}`;
      let resetExpireTime = Number(setting.resetpass_expire) * 24 + '小时';
      return [Mailer.sendResetPassEmail(user.email, resetPassLink, resetExpireTime), user, setting];
    })
    .spread((successInfo, user, setting) => {
      res.json({
        success: 1,
        message: `我们给邮箱${user.email}发送了重置密码邮件,请在${Number(setting.resetpass_expire) * 24}小时内点击重置链接重置您的密码`
      });
    })
    .catch(Respond.handleError(res));
}

// 执行重置密码
exports.resetPass = function(req, res) {
  Q.fcall(() => {
      // retrieve_key 是否存在
      if (!req.body.key) return Q.reject({
        statusCode: 403,
        message: '无效的重置密码链接'
      });
      return validator.trim(req.body.key);
    })
    .then(key => {
      // 数据库找retrieve_key
      return User.findOne({
        retrieve_key: key
      });
    })
    .then(user => {
      // 不合法的retrieve_key
      if (!user) return Q.reject({
        statusCode: 403,
        message: '无效的重置密码链接'
      });
      return user;
    })
    .then(user => {
      // 检查key的expire时间
      let now = new Date().getTime();
      if (now > user.retrieve_time) return Q.reject({
        statusCode: 403,
        message: '重置密码链接已经过期，请重新申请'
      });
      return user;
    })
    .then(user => {
      if (!req.body.password) return Q.reject({
        statusCode: 200,
        message: '请填写新密码'
      });
      return [user, req.body.password];
    })
    .spread((user, originPass) => {
      return [user, Utils.checkPass(originPass)];
    })
    .spread((user, hashedPass) => {
      user.password = hashedPass;
      user.changed = true;
      user.retrieve_key = null;
      user.retrieve_time = null;
      return user.save();
    })
    .then(() => {
      res.json({
        success: 1,
        message: '你的密码已经成功重置'
      });
    })
    .catch(Respond.handleError(res));

}