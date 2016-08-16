'use strict';

const _ = require('lodash');

let all = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 9000,
  ip: process.env.IP || '0.0.0.0',
  host: 'http://localhost:9000',
  seedDB: false,
  secrets: {
    sha1: 'this_is_my_sha1_secret',
    jwt: 'this_is_my_jwt_secret'
  },
  tokenExpires: '7d', //Eg: 60, "2 days", "10h", "7d"
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  mail: {
    service: '',
    auth: {
      user: '',
      pass: ''
    }
  },
  upload: {
    folderName: 'upload',
    maxSize: 5  //M
  }
};

module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {}
);