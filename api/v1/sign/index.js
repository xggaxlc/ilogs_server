'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./sign.controller');

router.post('/signin', Ctrl.signin);
router.post('/signup', Ctrl.signup);
router.post('/resetPass', Ctrl.applyResetPass);
router.put('/resetPass', Ctrl.resetPass);

module.exports = router;