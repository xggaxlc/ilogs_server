'use strict';

const error = require('../components/error');

module.exports = function(app) {
  app.route('/:url(api|config|components|)/*')
    .all(error[404]);
}