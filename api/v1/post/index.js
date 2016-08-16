'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./post.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;
const canLogin = CheckLogin.canLogin;

//检查权限
const checkPermission = require('../../../components/checkPermission');

router.get('/', canLogin, checkPermission, Ctrl.index);
router.get('/:id', canLogin, checkPermission, Ctrl.show);
router.post('/', mustLogin, checkPermission, Ctrl.create);
router.put('/:id', mustLogin, function(req, res, next) {
  // 修改自己的文章不需要permission验证
  if (req.params.id && (req.currentUser._id.toString() === req.params.id.toString())) {
    next();
  } else {
    checkPermission();
  }
}, Ctrl.update);
router.delete('/:id', mustLogin, checkPermission, Ctrl.destroy);

module.exports = router;