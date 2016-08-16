/**
 * GET     /             ->  index
 * GET     /:id          ->  show
 * POST    /             ->  create
 * PUT     /:id          ->  update
 * DELETE  /:id          ->  destroy
 */

'use strict';

const Q = require('q');
const Post = require('./post.model');
const Respond = require('../../../components/respond');

exports.index = function(req, res) {

  //未登录只能获取未发布的文章
  if (!req.currentUser) {
    req.query.puhlished = true;
  }

  let queryFormated = Respond.formatQuery(req.query, ['content'], ['title']);
  return Q.all(
      [
        Post.count(queryFormated.query).exec(),
        Post.find(queryFormated.query)
        .sort(queryFormated.sort)
        .limit(queryFormated.limit)
        .skip(queryFormated.skip)
        .populate('author', '-password')
        .populate('category')
        .populate('update_by')
        .select(queryFormated.select)
        .exec()
      ]
    )
    .spread(Respond.respondWithCountAndResult(res))
    .catch(Respond.handleError(res));
}

exports.show = function(req, res) {
  let condition = {
    _id: req.params.id
  }

  //未登录只能获取未发布的文章
  if (!req.currentUser) {
    condition.puhlished = true;
  }

  return Post.findOne(condition)
    .populate('author', '-password')
    .populate('category')
    .populate('update_by')
    .exec()
    .then(Respond.handleEntityNotFound())
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
    .then(Respond.handleEntityNotFound())
    .then(Respond.saveUpdate(req.body))
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.destroy = function(req, res) {
  return Post.findById(req.params.id).exec()
    .then(Respond.handleEntityNotFound())
    .then(Respond.removeEntity())
    .then(Respond.respondWithResult(res, 204))
    .catch(Respond.handleError(res));
}