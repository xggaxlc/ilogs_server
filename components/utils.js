'use strict';

const crypto = require('crypto');
const config = require('../config/environment');

exports.cryptoPass = function(pass) {
	return crypto.createHmac('sha1', config.secrets.sha1).update(pass).digest('hex');
}