// 重命名 => index.js

'use strict';

const _ = require('lodash');


let all = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 9000,
  ip: process.env.IP || '0.0.0.0',
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

let config = _.merge(
  all,
  require(`./${process.env.NODE_ENV || 'development'}.js`) || {}
);

// 自己看着改
config.host = `http://${config.ip}:${config.port}`;

module.exports = config;