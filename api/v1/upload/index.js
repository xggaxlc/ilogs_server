'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./upload.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;
router.use(mustLogin);

//检查权限
const checkPermission = require('../../../components/checkPermission');
router.use(checkPermission);

router.post('/image', Ctrl.uploadImage);
router.delete('/:filename', Ctrl.destroy);

module.exports = router;