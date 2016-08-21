const nodemailer = require('nodemailer');
const config = require('../config/environment');
const Q = require('q');

// https://github.com/nodemailer/nodemailer
var transport = nodemailer.createTransport({
	pool: false,
	service: config.mail.service,
	// port: 25,
	host: 'localhost',
	secure: false,
	auth: config.mail.auth,
	logger: false,
	debug: false
});

exports.sendMail = function(data) {
	let deferred = Q.defer();
	transport.sendMail(data, (err, info) => {
		if (err) return deferred.reject(err);
		deferred.resolve(info);
	});
	return deferred.promise;
}

exports.sendResetPassEmail = function(email, resetLink, resetExpire) {
	let data = {
		from: config.mail.auth.user,
		to: email,
		subject: '重置密码',
		html: `
			<h3>重置密码</h3>
			<p>此链接有效期: ${resetExpire}</p>
			<p>此链接仅可成功重置密码一次，成功重置密码后将立即失效</p>
			<p><a href="${resetLink}">点击重置密码</a></p>
		`
	}

	return exports.sendMail(data);
}

// invitor 邀请者
exports.sendInviteEmail = function(email, signupLink, signupExpire, invitor) {
	let data = {
		from: config.mail.auth.user,
		to: email,
		subject: '邀请您注册',
		html: `
			<h3><strong>${invitor.name}（email: ${invitor.email}）</strong>邀请您注册</h3>
			<p>此链接有效期: ${signupExpire}</p>
			<p>此链接仅可成功注册一次，成功注册后将立即失效</p>
			<p><a href="${signupLink}">点击注册</a></p>
		`
	}

	return exports.sendMail(data);
}