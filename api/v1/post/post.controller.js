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
const Post = require('./post.model');
const Utils = require('../../../components/utils');
const Respond = require('../../../components/respond');

exports.index = function(req, res) {
  let queryFormated = Utils.formatQuery(req.query, ['content'], ['title']);
  return Q.all(
      [
        Post.count(queryFormated.query).exec(),
        Post.find(queryFormated.query)
        .sort(queryFormated.sort)
        .limit(queryFormated.limit)
        .skip(queryFormated.skip)
        .populate('author', '-password')
        .populate('category')
        .populate('tags')
        .populate('update_by')
        .select(queryFormated.select)
        .exec()
      ]
    )
    .spread(Respond.respondWithCountAndResult(res))
    .catch(Respond.handleError(res));
}

exports.show = function(req, res) {
  return Post.findById(req.params.id)
    .populate('author', '-password')
    .populate('category')
    .populate('tags')
    .populate('update_by')
    .exec()
    .then(Respond.handleEntityNotFound(res))
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.create = function(req, res) {
  return Post.create(req.body)
    .then(Respond.respondWithResult(res, 201))
    .catch(Respond.handleError(res));
}

exports.update = function(req, res) {
  if (req.currentUser) {
    req.body.update_by = req.currentUser._id;
  }
  return Post.findById(req.params.id).exec()
    .then(Respond.handleEntityNotFound(res))
    .then(Respond.saveUpdate(req.body))
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.destroy = function(req, res) {
  return Post.findById(req.params.id).exec()
    .then(Respond.handleEntityNotFound(res))
    .then(Respond.removeEntity(res))
    .then(Respond.respondWithResult(res, 204))
    .catch(Respond.handleError(res));
}