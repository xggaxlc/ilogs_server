'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./invite.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;

//检查权限
const checkPermission = require('../../../components/checkPermission');

router.post('/', mustLogin, checkPermission, Ctrl.invite);

module.exports = router;