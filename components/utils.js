'use strict';

const _ = require('lodash');
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

	format.select = queryData.select 
		? queryData.select.replace(new RegExp(`${omitSelectArr.join('|')}`, 'gi'), '')
		: omitSelectArr.map((item) => `-${item}`).join(' ');


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

exports.cryptoPass = function(pass) {
	if (pass) return crypto.createHmac('sha1', config.secrets.sha1).update(pass).digest('hex');
}