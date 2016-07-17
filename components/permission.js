'use strict';

const _ = require('lodash');

module.exports = function(req, res, next, api) {
  let method = req.method.toLowerCase();
  let permissions = req.currentUser.permissions;
  api = api.toLowerCase();
  if (_.hasIn(permissions[api], method)) {
    permissions[api][method] ? next() : res.status(403).end();
  } else {
    //model没有这个权限字段(默认都有无需设置权限)
    next();
  }
}