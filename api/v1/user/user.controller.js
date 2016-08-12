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

function checkPass(pass) {
  var deferred = Q.defer();
  //不一定会更新password字段
  if (!pass) return Q.resolve();
  if (pass.length >= 6 && pass.length <= 16) {
    deferred.resolve(Utils.cryptoPass(pass));
  } else {
    deferred.reject({ statusCode: 200, message: '密码 必须是 6 - 16 个字符' });
  }
  return deferred.promise;
}

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
    .select('-password')
    .exec()
    .then(Respond.handleEntityNotFound(res))
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.create = function(req, res) {
  return checkPass(req.body.password)
    .then(hashedPass => {
      if (hashedPass) return req.body.password = hashedPass;
    })
    .then(() => {
      return User.create(req.body);
    })
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
  return checkPass(req.body.password)
    .then(hashedPass => {
      if (hashedPass) return req.body.password = hashedPass;
    })
    .then(() => {
      return User.findById(req.params.id).exec()
    })
    .then(Respond.handleEntityNotFound(res))
    .then(Respond.saveUpdate(req.body))
    .then(entity => {
      return User.populate(entity, { path: 'role', select: '-permissions' })
    })
    .then(entity => {
      let updatedUser = entity.toObject();
      delete updatedUser.password;
      return updatedUser;
    })
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