// 配置此文件 => 重命名为index.js

'use strict';

const path = require('path');
const _ = require('lodash');

(function() {
  if (!process.env.NODE_ENV) {
    throw new Error('你需要设置运行环境！');
  }
  return process.env.NODE_ENV;
})();


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
  }
};

module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {}
);