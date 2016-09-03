/**
 * GET     /category            ->  category
 * GET     /user        				->  user
 * GET     /role        				->  role
 * GET     /post        				->  post
 */

'use strict';

const Q = require('q');
const Category = require('../category/category.model');
const Post = require('../post/post.model');
const User = require('../user/user.model');
const Role = require('../role/role.model');
const Respond = require('../../../components/respond');

exports.category = function(req, res) {
  let limit = Number(req.query.limit) || 10;
  Q.all([
      Post.find().select('category').lean().exec(),
      Category.find().lean().exec()
    ])
    .spread((posts, categories) => {
      return categories.map(item => {
        return {
          name: item.name,
          count: posts.filter(deepItem => deepItem.category && deepItem.category.toString() === item._id.toString()).length
        }
      });
    })
    .then(arr => {
      return arr.sort((a, b) => b.count - a.count);
    })
    .then(sortedArr => {
      if (limit) return sortedArr.slice(0, limit);
      return sortedArr;
    })
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.user = function(req, res) {
  let limit = Number(req.query.limit) || 10;
  Q.all([
      Post.find().select('author').lean().exec(),
      User.find({ active: true }).lean().exec()
    ])
    .spread((posts, Users) => {
      return Users.map(item => {
        return {
          name: item.name,
          count: posts.filter(deepItem => deepItem.author && deepItem.author.toString() === item._id.toString()).length
        }
      });
    })
    .then(arr => {
      return arr.sort((a, b) => b.count - a.count);
    })
    .then(sortedArr => {
      if (limit) return sortedArr.slice(0, limit);
      return sortedArr;
    })
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

exports.role = function(req, res) {
  let limit = Number(req.query.limit) || 10;
  Q.all([
      User.find().select('role').lean().exec(),
      Role.find().lean().exec()
    ])
    .spread((users, roles) => {
      return roles.map(item => {
        return {
          name: item.name,
          count: users.filter(deepItem => deepItem.role && deepItem.role.toString() === item._id.toString()).length
        }
      });
    })
    .then(arr => {
      return arr.sort((a, b) => b.count - a.count);
    })
    .then(sortedArr => {
      if (limit) return sortedArr.slice(0, limit);
      return sortedArr;
    })
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));
}

// 获取统计月份
function createRange(limit) {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  var range = [];
  for (let i = 0; i < limit; i++) {
    let y = (month - i) < 0 ? year - 1 : year;
    let m = (month - i) < 0 ? 12 + (month - i) : (month - i);
    range.push({
      name: `${y}-${m + 1}`,
      range: [new Date(y, m, 1, 0, 0, 0, 0).getTime(), new Date(y, m + 1, 0, 23, 59, 59, 999).getTime()], //时间戳范围
      count: 0
    });
  }
  return range.reverse();
}

exports.post = function(req, res) {
  let limit = req.query.limit || 6;
  let queryFormated = Respond.formatQuery(req.query);
  Q.all([
      createRange(limit),
      Post.find(queryFormated.query).select('create_at').lean().exec()
    ])
    .spread((range, posts) => {
      return range.map(item => {
        return {
          name: item.name,
          count: posts.filter(deepItem => {
            let timestamp = deepItem.create_at.getTime();
            return timestamp >= item.range[0] && timestamp <= item.range[1];
          }).length
        }
      });
    })
    .then(Respond.respondWithResult(res))
    .catch(Respond.handleError(res));

}