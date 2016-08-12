/**
 * GET     /             ->  index
 * GET     /:id          ->  show
 * POST    /             ->  create
 * PUT     /:id          ->  update
 * DELETE  /:id          ->  destroy
 */

'use strict';

const _ = require('lodash');
const Q = require('q');
const User = require('./user.model');
const Utils = require('../../../components/utils');
const Respond = require('../../../components/respond');

exports.index = function(req, res) {
  let queryFormated = Utils.formatQuery(req.query, ['password'], ['name']);
  return Q.all(
      [
        User.count(queryFormated.query).exec(),
        User.find(queryFormated.query)
        .sort(queryFormated.sort)
        .limit(queryFormated.limit)
        .skip(queryFormated.skip)
        .populate('role', '-permissions')
        .populate('update_by', '-password')
        .select(queryFormated.select)
        .exec()
      ]
    )
    .spread(Respond.respondWithCountAndResult(res))
    .catch(Respond.handleError(res));
}

exports.show = function(req, res) {
  return User.findById(req.params.id)
    .populate('role', '-permissions')
    .populate('update_by', '-password')
    .select('-password')
    .exec()
    .then(Respond.handleEntityNotFound(res))
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.create = function(req, res) {
  return User.create(req.body)
    .then(entity => {
      return User.populate(entity, { path: 'role', select: '-permissions' });
    })
    .then(entity => {
      let newUser = entity.toObject();
      delete newUser.password;
      return newUser;
    })
    .then(Respond.respondWithResult(res, 201))
    .catch(Respond.handleError(res));
}

exports.update = function(req, res) {

  if(req.currentUser) {
    req.body.update_by = req.currentUser._id;
  }

  // http://mongoosejs.com/docs/validation.html
  return User.findOneAndUpdate({
      _id: req.params.id
    }, req.body, {
      runValidators: true,
      context: 'query',
      new: true
    })
    .populate('role', '-permissions')
    .populate('update_by', '-password')
    .select('-password')
    .exec()
    .then(Respond.handleEntityNotFound(res))
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