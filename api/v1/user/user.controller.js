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
const Utils = require('../../../components/utils');
const Respond = require('../../../components/respond');

function checkPass(pass) {
  let deferred = Q.defer();
  //不一定会更新password字段
  if (!pass) return Q.resolve();
  if (pass.length >= 6 && pass.length <= 16) {
    deferred.resolve(Utils.cryptoPass(pass));
  } else {
    deferred.reject({ statusCode: 200, message: '密码 必须是 6 - 16 个字符' });
  }
  return deferred.promise;
}

// 非master用户无法修改master用户
function checkMaster(updateUser, currentUser) {
  let deferred = Q.defer();
  if (updateUser.master && !currentUser.master) {
    deferred.reject({ statusCode: 200, message: '你无法修改MASTER用户' });
  } else {
    deferred.resolve(updateUser);
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
    .then(Respond.handleEntityNotFound())
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.create = function(req, res) {

  return User.count().exec()
    .then(count => {
      //第一个用户是管理员用户
      req.body.master = count ? true : false;
    })
    .then(() => {
      return checkPass(req.body.password)
    })
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
  // master字段不能修改
  delete req.body.master;

  //非master不能修改用户角色(间接拿到权限)
  if (!req.currentUser.master) {
    delete req.body.role;
  }

  return checkPass(req.body.password)
    .then(hashedPass => {
      if (hashedPass) return req.body.password = hashedPass;
    })
    .then(() => {
      return User.findById(req.params.id).exec();
    })
    .then(entity => {
      return checkMaster(entity, req.currentUser);
    })
    .then(Respond.handleEntityNotFound())
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
    .then(entity => {
      return checkMaster(entity, req.currentUser);
    })
    .then(Respond.handleEntityNotFound())
    .then(Respond.removeEntity())
    .then(Respond.respondWithResult(res, 204))
    .catch(Respond.handleError(res));
}