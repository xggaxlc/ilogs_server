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

// 非master用户无法修改master用户
function checkMaster(updateUser, currentUser) {
  let deferred = Q.defer();
  if (updateUser.master && !currentUser.master) {
    deferred.reject({
      statusCode: 200,
      message: '你无法修改MASTER用户'
    });
  } else {
    deferred.resolve(updateUser);
  }
  return deferred.promise;
}

exports.index = function(req, res) {
  let queryFormated = Respond.formatQuery(req.query, ['password'], ['name']);
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
  delete req.body.master;
  return Utils.checkPass(req.body.password)
    .then(hashedPass => {
      if (hashedPass) {
        req.body.password = hashedPass;
      }
      return req.body;
    })
    .then(() => {
      return User.create(req.body);
    })
    .then(entity => {
      return User.populate(entity, {
        path: 'role',
        select: '-permissions'
      });
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

  //非master不能修改用户角色(间接拿到权限) master用户不能给自己加角色(无意义)
  if (!req.currentUser.master || (req.currentUser._id.toString() === req.params.id.toString())) {
    delete req.body.role;
  }

  return Utils.checkPass(req.body.password)
    .then(hashedPass => {
      if (hashedPass) {
        req.body.password = hashedPass;
      }
      return req.body;
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
      return User.populate(entity, {
        path: 'role',
        select: '-permissions'
      })
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
  if (req.params.id.toString() === req.currentUser._id.toString()) {
    return res.json({ success: 0, message: '你无法删除你自己' });
  }
  return User.findById(req.params.id).exec()
    .then(entity => {
      return checkMaster(entity, req.currentUser);
    })
    .then(Respond.handleEntityNotFound())
    .then(Respond.removeEntity())
    .then(Respond.respondWithResult(res, 204))
    .catch(Respond.handleError(res));
}