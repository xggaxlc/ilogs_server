/**
 * GET     /             ->  index
 * GET     /:id          ->  show
 * POST    /             ->  create
 * PUT     /:id          ->  update
 * DELETE  /:id          ->  destroy
 */

'use strict';

const Q = require('q');
const Category = require('./category.model');
const Respond = require('../../../components/respond');

exports.index = function(req, res) {
  let queryFormated = Respond.formatQuery(req.query, [], ['name']);
  return Q.all(
      [
        Category.count(queryFormated.query).exec(),
        Category.find(queryFormated.query)
        .sort(queryFormated.sort)
        .limit(queryFormated.limit)
        .skip(queryFormated.skip)
        .select(queryFormated.select)
        .exec()
      ]
    )
    .spread(Respond.respondWithCountAndResult(res))
    .catch(Respond.handleError(res));
}

exports.show = function(req, res) {
  return Category.findById(req.params.id).exec()
    .then(Respond.handleEntityNotFound())
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.create = function(req, res) {
  return Category.create(req.body)
    .then(Respond.respondWithResult(res, 201))
    .catch(Respond.handleError(res));
}

exports.update = function(req, res) {
  return Category.findById(req.params.id).exec()
    .then(Respond.handleEntityNotFound())
    .then(Respond.saveUpdate(req.body))
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.destroy = function(req, res) {
  return Category.findById(req.params.id).exec()
    .then(Respond.handleEntityNotFound())
    .then(Respond.removeEntity())
    .then(Respond.respondWithResult(res, 204))
    .catch(Respond.handleError(res));
}