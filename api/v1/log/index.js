'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./log.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;

router.use(mustLogin);

router.get('/', Ctrl.index);
router.get('/:id', Ctrl.show);

module.exports = router;