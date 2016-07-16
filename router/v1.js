'use strict';

module.exports = function(app) {
	let categoryController = require('../api/v1/category');
  let tagController = require('../api/v1/tag');

	app.use('/api/v1/category', categoryController);
  app.use('/api/v1/tag', tagController);

  app.route('/:url(api|config|components|)/*')
    .all((req, res) => { res.status(404).end() });
}