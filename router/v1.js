'use strict';

module.exports = function(app) {
  let categoryController = require('../api/v1/category');
  let roleController = require('../api/v1/role');
  let userController = require('../api/v1/user');
  let postController = require('../api/v1/post');
  let settingController = require('../api/v1/setting');
  let signController = require('../api/v1/sign');

  app.use('/api/v1/sign', signController);

  //登录验证
  app.use(require('../components/token').vertifyToken);

  app.use('/api/v1/category', categoryController);
  app.use('/api/v1/role', roleController);
  app.use('/api/v1/user', userController);
  app.use('/api/v1/post', postController);
  app.use('/api/v1/setting', settingController);
  

  app.route('/:url(api|config|components|)/*')
    .all((req, res) => {
      res.status(404).end();
    });
}