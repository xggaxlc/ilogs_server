'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./role.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;

//检查权限
const checkPermission = require('../../../components/checkPermission');

router.get('/', mustLogin, checkPermission, Ctrl.index);
router.get('/:id', mustLogin, checkPermission, Ctrl.show);
router.post('/', mustLogin, checkPermission, Ctrl.create);
router.put('/:id', mustLogin, checkPermission, Ctrl.update);
router.delete('/:id', mustLogin, checkPermission, Ctrl.destroy);

module.exports = router;