'use strict';

const validate = require('mongoose-validator');

exports.titleValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 80],
    message: '标题 不能大于 {ARGS[1]} 个字符'
  })
];
