'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./upload.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;

router.use(mustLogin);

router.post('/image', Ctrl.uploadImage);
router.delete('/:filename', Ctrl.destroy);

module.exports = router;