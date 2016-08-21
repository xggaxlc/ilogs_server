/**
 * GET     /             ->  index
 * POST    /             ->  save
 */

'use strict';

const Setting = require('./setting.model');
const Respond = require('../../../components/respond');

exports.index = function(req, res) {
  return Setting.find().exec()
    .then(resArr => {
      if (!resArr.length) {
        return Setting.create({});
      }
      return resArr[0];
    })
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.save = function(req, res) {
  if (!req.body._id) return res.json({
    success: 0,
    message: '需要先GET请求此接口创建setting'
  });
  return Setting.findById(req.body._id).exec()
    .then(Respond.handleEntityNotFound())
    .then(Respond.saveUpdate(req.body))
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}