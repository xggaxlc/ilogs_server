'use strict';

module.exports = function(app) {
  let categoryController = require('../api/v1/category');
  let tagController = require('../api/v1/tag');
  let roleController = require('../api/v1/role');
  let userController = require('../api/v1/user');
  let postController = require('../api/v1/post');
  let settingController = require('../api/v1/setting');

  app.use('/api/v1/category', categoryController);
  app.use('/api/v1/tag', tagController);
  app.use('/api/v1/role', roleController);
  app.use('/api/v1/user', userController);
  app.use('/api/v1/post', postController);
  app.use('/api/v1/setting', settingController);

  app.route('/:url(api|config|components|)/*')
    .all((req, res) => {
      res.status(404).end();
    });
}