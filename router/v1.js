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

  app.use('/api/invite', inviteController);
  app.use('/api/sign', signController);
  app.use('/api/category', categoryController);
  app.use('/api/role', roleController);
  app.use('/api/user', userController);
  app.use('/api/post', postController);
  app.use('/api/setting', settingController);
  app.use('/api/upload', uploadController);
  app.use('/api/log', logController);
  app.use('/api/statistics', statisticsController);

  app.route('/:url(api|config|components|)/*')
    .all((req, res) => {
      res.status(404).end();
    });
}