'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./role.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;
// const canLogin = CheckLogin.canLogin;

router.use(mustLogin);

router.get('/', Ctrl.index);
router.get('/:id', Ctrl.show);
router.post('/', Ctrl.create);
router.put('/:id', Ctrl.update);
router.delete('/:id', Ctrl.destroy);

module.exports = router;