/**
 * GET     /             ->  index
 * GET     /:id          ->  show
 * POST    /             ->  create
 * PUT     /:id          ->  update
 * DELETE  /:id          ->  destroy
 */

'use strict';

const Q = require('q');
const _ = require('lodash');
const Role = require('./role.model');
const Respond = require('../../../components/respond');

exports.index = function(req, res) {
  return Q.all(
      [
        Role.count().exec(),
        Role.find().exec()
      ]
    )
    .spread(Respond.respondWithCountAndResult(res))
    .catch(Respond.handleError(res));
}

exports.show = function(req, res) {
  let id = req.params.id;

  if (id === 'template') {
    Q.fcall(() => {
      return _.pick(new Role(), ['permissions', 'active']);
    })
    .then(Respond.respondWithResult(res));
  } else {
    Role.findById(id).exec()
    .then(Respond.handleEntityNotFound())
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
  }
}

exports.create = function(req, res) {
  return Role.create(req.body)
    .then(Respond.respondWithResult(res, 201))
    .catch(Respond.handleError(res));
}

exports.update = function(req, res) {
  return Role.findById(req.params.id).exec()
    .then(Respond.handleEntityNotFound())
    .then(Respond.saveUpdate(req.body))
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.destroy = function(req, res) {
  return Role.findById(req.params.id).exec()
    .then(Respond.handleEntityNotFound())
    .then(Respond.removeEntity())
    .then(Respond.respondWithResult(res, 204))
    .catch(Respond.handleError(res));
}