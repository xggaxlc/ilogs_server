/**
 * GET     /             ->  index
 * GET     /:id          ->  show
 */

'use strict';

const Q = require('q');
const Log = require('./log.model');
const Respond = require('../../../components/respond');

exports.index = function(req, res) {
  let queryFormated = Respond.formatQuery(req.query, [], ['content']);
  return Q.all(
      [
        Log.count(queryFormated.query).exec(),
        Log.find(queryFormated.query)
        .sort(queryFormated.sort)
        .limit(queryFormated.limit)
        .skip(queryFormated.skip)
        .populate('name', 'name')
        .select(queryFormated.select)
        .exec()
      ]
    )
    .spread(Respond.respondWithCountAndResult(res))
    .catch(Respond.handleError(res));
}

exports.show = function(req, res) {
  return Log.findById(req.params.id)
    .populate('name', 'name')
    .exec()
    .then(Respond.handleEntityNotFound())
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}