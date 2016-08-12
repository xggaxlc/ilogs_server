const nodemailer = require('nodemailer');
const config = require('../config/environment');
const Q = require('q');

// https://github.com/nodemailer/nodemailer
var transport = nodemailer.createTransport({
	pool: false,
	service: config.mail.service,
	port: 25,
	host: 'localhost',
	secure: false,
	auth: config.mail.auth,
	logger: true,
	debug: true
});

exports.sendMail = function(data) {
	let deferred = Q.defer();
	transport.sendMail(data, (err, info) => {
		if (err) return deferred.reject(err);
		deferred.resolve(info);
	});
	return deferred.promise;
}