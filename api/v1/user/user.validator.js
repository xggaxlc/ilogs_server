'use strict';

const validate = require('mongoose-validator');

exports.nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 10],
    message: '姓名 必须是 {ARGS[0]} 到 {ARGS[1]} 个字符'
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: '姓名 只支持数字和字母'
  })
];

exports.emailValidator = [
  validate({
    validator: 'isEmail',
    passIfEmpty: true,
    message: '邮箱 格式不对'
  })
];

exports.pwValidator = [
  validate({
    validator: 'isLength',
    arguments: [6, 16],
    message: '密码 必须是 {ARGS[0]} 到 {ARGS[1]} 个字符'
  })
];

exports.avatarValidator = [
  validate({
    validator: 'isURL',
    passIfEmpty: true,
    message: '头像链接 格式不对'
  })
];
