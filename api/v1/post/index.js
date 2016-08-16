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

function canSkipCheckPermission(req, res, next) {
  if (req.params.id && (req.currentUser._id.toString() === req.params.id.toString())) {
    next();
  } else {
    checkPermission();
  }
}

router.get('/', canLogin, checkPermission, Ctrl.index);
router.get('/:id', canLogin, checkPermission, Ctrl.show);
router.post('/', mustLogin, checkPermission, Ctrl.create);
// 删除和修改自己的文章不需要检查权限
router.put('/:id', mustLogin, canSkipCheckPermission, Ctrl.update);
router.delete('/:id', mustLogin, canSkipCheckPermission, Ctrl.destroy);

module.exports = router;