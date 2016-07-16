/**
 * GET     /             ->  index
 * GET     /:id          ->  show
 * POST    /             ->  create
 * PUT     /:id          ->  update
 * DELETE  /:id          ->  destroy
 */

'use strict';

const Q = require('q');
const User = require('./user.model');
const Respond = require('../../../components/respond');

exports.index = function(req, res) {
  return Q.all(
      [
        User.count().exec(),
        User.find().select('-password').exec()
      ]
    )
    .spread(Respond.respondWithCountAndResult(res))
    .catch(Respond.handleError(res));
}

exports.show = function(req, res) {
  return User.findById(req.params.id).select('-password').exec()
    .then(Respond.handleEntityNotFound(res))
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.create = function(req, res) {
  return User.create(req.body)
    .then(Respond.respondWithResult(res, 201))
    .catch(Respond.handleError(res));
}

exports.update = function(req, res) {
  return User.findById(req.params.id).exec()
    .then(Respond.handleEntityNotFound(res))
    .then(Respond.saveUpdate(req.body))
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.destroy = function(req, res) {
  return User.findById(req.params.id).exec()
    .then(Respond.handleEntityNotFound(res))
    .then(Respond.removeEntity(res))
    .then(Respond.respondWithResult(res, 204))
    .catch(Respond.handleError(res));
}