'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./statistics.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;

//检查权限
const checkPermission = require('../../../components/checkPermission');

router.get('/category', mustLogin, checkPermission, Ctrl.category);
router.get('/user', mustLogin, checkPermission, Ctrl.user);
router.get('/role', mustLogin, checkPermission, Ctrl.role);
router.get('/post', mustLogin, checkPermission, Ctrl.post);

module.exports = router;