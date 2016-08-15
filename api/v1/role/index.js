'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./role.controller');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;
router.use(mustLogin);

//检查权限
const checkPermission = require('../../../components/checkPermission');
router.use(checkPermission);

router.get('/', Ctrl.index);
router.get('/:id', Ctrl.show);
router.post('/', Ctrl.create);
router.put('/:id', Ctrl.update);
router.delete('/:id', Ctrl.destroy);

module.exports = router;