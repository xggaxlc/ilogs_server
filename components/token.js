'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const User = require('../api/v1/user/user.model');
const Role = require('../api/v1/role/role.model');
const Q = require('q');
const SECRETKEY = config.secrets.jwt;

function updateRoleChanged(user) {
  return Role.findById(user.role._id)
    .exec()
    .then(entity => {
      entity.set({
        changed: false
      });
      return entity.save();
    });
}

exports.createToken = function(user) {
  let payload = {
    _id: user._id
  };
  let options = {
    expiresIn: config.tokenExpires
  };
  return jwt.sign(payload, SECRETKEY, options);
}

exports.vertifyToken = function(req, res, next) {
  let token = req.headers.token || req.body.token || req.params.token || req.query.token;
  let options = {
    ignoreExpiration: false
  };

  return jwt.verify(token, SECRETKEY, options, (err, decoded) => {
    //token已经过期或无效
    if (err) return res.status(401).end();
    User.findById(decoded._id)
      .populate('role')
      .exec()
      .then(user => {
        //可能客户端的token正常,但是用户被删除了
        if (!user) return Q.reject({
          statusCode: 401
        });
        //所在用户组权限变更,需要重新登录
        if (user.role.changed) {
          return updateRoleChanged(user)
            .then(() => {
              return Q.reject({
                statusCode: 401
              });
            });
        }
        req.currentUser = user;
        next();
      })
      .catch(err => {
        if (!err.statusCode) {
          console.error(err, 'components/token.js');
        }
        return res.status(err.statusCode || 500).end();
      });
  });
}