'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./user.controller');

// 检查权限
// router.use((req, res, next) => {
//   require('../../../components/permission')(req, res, next, 'user');
// });

router.get('/', Ctrl.index);
router.get('/:id', Ctrl.show);
router.post('/', Ctrl.create);
router.put('/:id', Ctrl.update);
router.delete('/:id', Ctrl.destroy);

module.exports = router;