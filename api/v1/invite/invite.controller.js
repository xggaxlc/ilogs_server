/**
 * POST    /             ->  invite
 */

'use strict';

const Q = require('q');
const uuid = require('uuid');
const validator = require('validator');
const User = require('../user/user.model');
const Setting = require('../setting/setting.model');
const Respond = require('../../../components/respond');
const Mailer = require('../../../components/mail');

exports.invite = function(req, res) {
  Q.fcall(() => {
      let email = req.body.email;
      let role = req.body.role;
      if (!email) return Q.reject({
        statusCode: 200,
        message: '邮箱必填!'
      });
      if (!role) return Q.reject({
        statusCode: 200,
        message: '用户组必填'
      });
      return validator.trim(email).toLowerCase();
    })
    .then(email => {
      if (!validator.isEmail(email)) return Q.reject({
        statusCode: 200,
        message: '邮箱格式不正确'
      });
      return [email, User.findOne({
        email: email
      })];
    })
    .spread((email, user) => {
      if (user) return Q.reject({
        statusCode: 200,
        message: '此邮箱已经被使用'
      });
      // 查找配置  (检查email唯一在Model进行)
      return [email, Setting.find().exec()];
    })
    .spread((email, setting) => {
      setting = setting[0] || [];
      if (!setting.signup_link) return Q.reject({
        statusCode: 200,
        message: '需要设置邀请注册链接'
      });
      if (!setting.signup_expire) return Q.reject({
        statusCode: 200,
        message: '需要设置邀请注册过期时间'
      });

      let user = new User();

      let retrieveKey = uuid.v4();
      // retrieveKey过期时间
      let retrieveTime = new Date().getTime() + Number(setting.signup_expire) * 24 * 60 * 60 * 1000;

      user.active = false;
      user.name = '等待接受邀请' + retrieveKey
      user.email = email;
      user.role = req.body.role;
      user.retrieve_key = retrieveKey;
      user.retrieve_time = retrieveTime;
      return [user.save({
        validateBeforeSave: false
      }), setting];
    })
    .spread((user, setting) => {
      let signupLink = `${setting.signup_link}?key=${user.retrieve_key}`;
      let signupExpireTime = Number(setting.signup_expire) + '天';
      // 邀请人
      let invitor = req.currentUser;
      return [Mailer.sendInviteEmail(user.email, signupLink, signupExpireTime, invitor), user];
    })
    .spread((successInfo, user) => {
      res.json({
        success: 1,
        message: `我们给邮箱${user.email}发送了注册邮件`
      });
    })
    .catch(Respond.handleError(res));
}