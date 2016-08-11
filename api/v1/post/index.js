'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./post.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;
const canLogin = CheckLogin.canLogin;

router.get('/', canLogin, Ctrl.index);
router.get('/:id', canLogin, Ctrl.show);
router.post('/', mustLogin, Ctrl.create);
router.put('/:id', mustLogin, Ctrl.update);
router.delete('/:id', mustLogin, Ctrl.destroy);

module.exports = router;