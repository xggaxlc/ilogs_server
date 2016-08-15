const Q = require('q');
const _ = require('lodash');

exports.respondWithResult = function(res, statusCode = 200) {
  return entity => {
    return entity ? res.status(statusCode).json({
      data: entity
    }) : res.status(statusCode).end();
  }
}

exports.respondWithCountAndResult = function(res, statusCode = 200) {
  return (count, entity) => {
    res.status(statusCode).json({
      count: count,
      data: entity
    });
  }
}

exports.saveUpdate = function(updates) {
  delete updates._id;
  return entity => {
    entity.set(updates);
    return entity.save();
  }
}

exports.removeEntity = function() {
  return entity => {
    return entity.remove();
  }
}

exports.handleEntityNotFound = function() {
  return entity => {
    if (!entity) return Q.reject({
      statusCode: 404,
      message: '没有找到这条数据！'
    });
    return entity;
  }
}

exports.handleError = function(res) {
  return err => {
    if (err.name === 'ValidationError') {
      var errorMsg = [];
      for (let error in err.errors) {
        errorMsg.push(err.errors[error].message);
      }
      res.json({
        success: 0,
        message: errorMsg.join(',')
      });
    } else {
      if (err.statusCode) {
        let error = _.omit(_.merge({
          success: 0
        }, err), 'statusCode');
        res.status(err.statusCode).json(error);
      } else {
        let error = {
          success: 0,
          message: err.message
        }
        err.type === 'validateError' ? res.json(error) : res.status(500).json(error);
      }
    }

  }
}