'use strict';

const _ = require('lodash');
const Q = require('q');
const crypto = require('crypto');
const config = require('../config/environment');

exports.formatQuery = function(queryData, omitSelectArr = [], linkQueryArr = []) {
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
	linkQueryArr.forEach(field => {
		if (format.query[field]) {
			format.query[field] = {
				$regex: format.query[field]
			}
		}
	});
	return format;
}

exports.ValidateError = class ValidateError extends Error {
	constructor(msg) {
		super();
		this.type = 'validateError';
		this.message = msg;
	}
}

exports.checkPass = function(pass) {
	let deferred = Q.defer();
	//不一定会更新password字段
	if (!pass) {
		deferred.resolve();
		return deferred.promise;
	}
	if (pass.length >= 6 && pass.length <= 16) {
		deferred.resolve(exports.cryptoPass(pass));
	} else {
		deferred.reject({
			statusCode: 200,
			message: '密码 必须是 6 - 16 个字符'
		});
	}
	return deferred.promise;
}

exports.cryptoPass = function(pass) {
	if (pass) return crypto.createHmac('sha1', config.secrets.sha1).update(pass).digest('hex');
}