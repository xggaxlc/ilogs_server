'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./upload.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;

//检查权限
const checkPermission = require('../../../components/checkPermission');

router.post('/image', mustLogin, checkPermission, Ctrl.uploadImage);
router.delete('/:filename', mustLogin, checkPermission, Ctrl.destroy);

module.exports = router;