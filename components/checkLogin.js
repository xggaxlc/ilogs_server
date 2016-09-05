'use strict';

const vertifyToken = require('./token').vertifyToken;
const User = require('../api/v1/user/user.model');
const Q = require('q');
const _ = require('lodash');

function findUser() {
  return user_id => {
    return User.findById(user_id)
      .populate('role')
      .exec()
      .then(user => {
        // 可能客户端的token正常,但是用户被删除了
        if (!user) return Q.reject({
          statusCode: 401,
          message: '此用户可能已经被删除！'
        });

        if (user.changed) return Q.reject({
          statusCode: 401,
          message: '信息有变动，需要重新登录！'
        });

        return user;
      });
  }
}


function checkLogin(req, res, next, mustLogin) {
  let token = req.headers.token || req.query.token || req.body.token || req.params.token;
  // 设置currentUser;
  global.currentUser = null;
  if (!token) {
    mustLogin ? res.status(401).json({
      success: 0,
      message: '请登录!'
    }) : next();
  } else {
    vertifyToken(token)
      .then(findUser())
      .then(user => {
        // 存global好像不太好...
        global.currentUser = req.currentUser = user;
        next();
      })
      .catch(err => {
        let error = _.merge(err, {
          success: 0
        });
        err.statusCode ? res.status(err.statusCode).json(error) : res.status(500).json(error);
      });
  }
}

exports.mustLogin = function(req, res, next) {
  checkLogin(req, res, next, true);
}

exports.canLogin = function(req, res, next) {
  checkLogin(req, res, next, false);
}