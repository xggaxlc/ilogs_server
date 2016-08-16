'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./setting.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;
router.use(mustLogin);

//检查权限
const checkPermission = require('../../../components/checkPermission');
router.use(checkPermission);

router.get('/', Ctrl.index);
router.post('/', Ctrl.save);

module.exports = router;