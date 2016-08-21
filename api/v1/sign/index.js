'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./sign.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;

//检查权限
const checkPermission = require('../../../components/checkPermission');

router.post('/signin', Ctrl.signin);
router.post('/signup', Ctrl.signup);
router.post('/applyResetPass', Ctrl.applyResetPass);
router.post('/resetPass', Ctrl.resetPass);
router.post('/invite', mustLogin, checkPermission, Ctrl.invite);

module.exports = router;