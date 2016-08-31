'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./statistics.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;

router.use(mustLogin);

router.get('/category', Ctrl.category);
router.get('/user', Ctrl.user);
router.get('/role', Ctrl.role);
router.get('/post', Ctrl.post);

module.exports = router;