/**
 * POST    /             ->  create
 */

'use strict';

const Mail = require('../../../components/mail');

exports.create = function(req, res) {
	Mail.sendMail({
			from: '',
			to: '',
			subject: '测试邮件',
			html: '<b>Hello world </b>'
		})
		.then(info => {
			res.json(info)
		})
		.catch(err => {
			res.json({
				success: 0,
				message: '邮件发送失败！',
				error: err
			});
		});
}