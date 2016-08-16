'use strict';

const Q = require('q');
const _ = require('lodash');

// queryData => 查询数据
// omitSelectArr => 不需要返回的字段 array
// likeQueryArr => 模糊查询字段 array
exports.formatQuery = function(queryData, omitSelectArr = [], likeQueryArr = []) {
  let format = {};
  format.sort = queryData.sort || '-_id';
  format.limit = Number(queryData.limit) || 10;

  //一次最多获取50条数据
  format.limit = format.limit > 50 ? 50 : format.limit;

  format.page = Number(queryData.page) || 1;
  format.skip = (format.page - 1) * format.limit;

  format.select = queryData.select ?
    queryData.select.replace(new RegExp(`${omitSelectArr.join('|')}`, 'gi'), '') :
    omitSelectArr.map((item) => `-${item}`).join(' ');

  format.query = _.omit(queryData, 'sort', 'limit', 'page', 'select');
  likeQueryArr.forEach(field => {
    if (format.query[field]) {
      format.query[field] = {
        $regex: format.query[field]
      }
    }
  });
  return format;
}

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
  delete updates._v;
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
      // mongoose 字段验证错误
      var errorMsg = [];
      for (let error in err.errors) {
        errorMsg.push(err.errors[error].message);
      }
      res.json({
        success: 0,
        message: errorMsg.join(',')
      });
    } else if (err.statusCode) {
      //promise 主动reject错误
      let error = _.omit(_.merge({
        success: 0
      }, err), 'statusCode');
      res.status(err.statusCode).json(error);
    } else if (err.type === 'validateError') {
      // 自定义validate错误类型
      res.json({
        success: 0,
        message: err.message
      });
    } else {
      // 其他错误
      console.error(err);
      res.status(500).json(err);
    }
  }
}