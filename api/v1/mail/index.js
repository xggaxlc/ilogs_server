'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./mail.controller');

// 检查登陆
// const CheckLogin = require('../../../components/checkLogin');
// const mustLogin = CheckLogin.mustLogin;
// const canLogin = CheckLogin.canLogin;

router.post('/', Ctrl.create);

module.exports = router;