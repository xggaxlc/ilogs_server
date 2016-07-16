'use strict';

module.exports = function(app) {
	let categoryController = require('../api/v1/category');

	app.use('/api/v1/category', categoryController);

  app.route('/:url(api|config|components|)/*')
    .all((req, res) => { res.status(404).end() });
}