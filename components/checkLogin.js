'use strict';

const vertifyToken = require('./token').vertifyToken;
const User = require('../api/v1/user/user.model');
const Role = require('../api/v1/role/role.model');
const Q = require('q');

function findUser() {
	return user_id => {
		return User.findById(user_id)
		.populate('role')
		.exec()
		.then(user => {
			// 可能客户端的token正常,但是用户被删除了
      if (!user) return Q.reject({ statusCode: 401, message: '此用户可能已经被删除！' });	
      return user;
		}); 
	}
}

function updateRoleChanged(user) {
  return Role.findById(user.role._id)
    .exec()
    .then(entity => {
      entity.set({
        changed: false
      });
      return entity.save();
    });
}

function checkRoleChange() {
	return user => {
		if (user.role.changed) {
			return updateRoleChanged(user)
				.then(() => {
					Q.reject({ statusCode: 401, message: '用户组权限有变更，需要重新登陆！' });
				});
		}
		return user;
	}
}

function checkLogin(req, res, next, mustLogin) {
	let token = req.headers.token || req.body.token || req.params.token || req.query.token;
	if (!token) {
		mustLogin ? res.status(401).json({ message: '请登录!' }) : next();
	} else {
		vertifyToken(token)
			.then(findUser())
			.then(checkRoleChange())
			.then(user => {
				req.currentUser = user;
				next();
			})
			.catch(err => {
				err.statusCode ? res.status(err.statusCode).json(err) : res.status(500).json(err);
			});
	}
}

exports.mustLogin = function(req, res, next) {
	checkLogin(req, res, next, true);
}

exports.canLogin = function(req, res, next) {
	checkLogin(req, res, next, false);
}