'use strict';

const express = require('express');
const router = express.Router();
const Ctrl = require('./post.controller');

const Post = require('./post.model');

// 检查登陆
const CheckLogin = require('../../../components/checkLogin');
const mustLogin = CheckLogin.mustLogin;
const canLogin = CheckLogin.canLogin;

//检查权限
const checkPermission = require('../../../components/checkPermission');

function canSkipCheckPermission(req, res, next) {
  if (req.params.id) {
    Post.findById(req.params.id).lean().exec()
      .then(post => {
        if(post.author.toString() === req.currentUser._id.toString()) {
          next();
        } else {
          checkPermission(req, res, next);
        }
      });
  } else {
    res.json({
      success: 0,
      message: '请提供数据id'
    });
  }
}

router.get('/', canLogin, checkPermission, Ctrl.index);
router.get('/:id', canLogin, checkPermission, Ctrl.show);
router.post('/', mustLogin, checkPermission, Ctrl.create);
// 删除和修改自己的文章不需要检查权限
router.put('/:id', mustLogin, canSkipCheckPermission, Ctrl.update);
router.delete('/:id', mustLogin, canSkipCheckPermission, Ctrl.destroy);

module.exports = router;