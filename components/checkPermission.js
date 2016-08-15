'use strict';

const _ = require('lodash');

module.exports = function(req, res, next) {
  //无需登录验证的API，不用验证权限
  if (!req.currentUser) return next();

  //master无需验证
  if (req.currentUser.master) {
    next();
  } else {
    let api = req.baseUrl.split('/').pop().toLowerCase();
    let method = req.method.toLowerCase();
    let permissions = req.currentUser.role.permissions;
    if (_.has(permissions[api], method)) {
      permissions[api][method] ? next() : res.status(403).end();
    } else {
      //model没有这个权限字段(默认都有无需设置权限)
      next();
    }
  }

}