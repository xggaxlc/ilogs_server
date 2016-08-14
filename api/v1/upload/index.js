'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./upload.controller');

router.post('/avatar', Ctrl.avatar);
router.delete('/avatar/:filename', Ctrl.deteteAvatar);

module.exports = router;