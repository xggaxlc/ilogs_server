'use strict';

module.exports[404] = function dataNotFound(req, res) {
  let statusCode = 404;
  res.status(statusCode).end();
};