/**
 * GET     /category            ->  category
 * GET     /user        				->  user
 * GET     /role        				->  role
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
	.then(Respond.respondWithResult(res));
}

exports.user = function(req, res) {
	let limit = Number(req.query.limit) || 10;
	Q.all([
		Post.find().select('author').lean().exec(),
		User.find().lean().exec()
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
	.then(Respond.respondWithResult(res));
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
	.then(Respond.respondWithResult(res));
}

exports.post = function(req, res) {
	let limit = req.query.limit || 6;
	let now = new Date();
	let year = now.getFullYear();
	let month = now.getMonth();
	let date = now.getDate();
	// console.log(year, month, date)
}