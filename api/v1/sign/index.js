'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./sign.controller');

router.post('/', Ctrl.signin);

module.exports = router;