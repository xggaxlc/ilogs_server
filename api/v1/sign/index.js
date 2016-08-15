'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./sign.controller');

router.post('/signin', Ctrl.signin);
router.post('/signup', Ctrl.signup);

module.exports = router;