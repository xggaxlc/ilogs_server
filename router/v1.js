'use strict';

module.exports = function(app) {

  let inviteController = require('../api/v1/invite');
  let signController = require('../api/v1/sign');
  let categoryController = require('../api/v1/category');
  let roleController = require('../api/v1/role');
  let userController = require('../api/v1/user');
  let postController = require('../api/v1/post');
  let settingController = require('../api/v1/setting');
  let uploadController = require('../api/v1/upload');
  let logController = require('../api/v1/log');
  let statisticsController = require('../api/v1/statistics');

  app.use((req, res, next) => {
    // 设置当前登录用户currentUser;
    global.currentUser = null;
    // 设置当前请求方法
    global.reqMethod = req.method.toUpperCase();
    next();
  });

  app.use('/invite', inviteController);
  app.use('/sign', signController);
  app.use('/category', categoryController);
  app.use('/role', roleController);
  app.use('/user', userController);
  app.use('/post', postController);
  app.use('/setting', settingController);
  app.use('/upload', uploadController);
  app.use('/log', logController);
  app.use('/statistics', statisticsController);

  app.route('/:url(api|config|components|)/*')
    .all((req, res) => {
      res.status(404).end();
    });
}