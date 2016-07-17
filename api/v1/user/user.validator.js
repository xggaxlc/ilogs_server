'use strict';

const validate = require('mongoose-validator');

exports.nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 10],
    message: '姓名 必须是 {ARGS[0]} 到 {ARGS[1]} 个字符'
  })
  // validate({
  //   validator: 'matches',
  //   arguments: ['^([\u4E00-\u9FA5]|\w)*$'],
  //   passIfEmpty: true,
  //   message: '姓名 不能包含特殊字符'
  // })
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
    passIfEmpty: true,
    message: '密码 必须是 {ARGS[0]} - {ARGS[1]} 个字符'
  })
];

exports.telValidator = [
  validate({
    validator: 'isNumeric',
    passIfEmpty: true,
    message: '电话 必须是数字'
  }),
  validate({
    validator: 'isLength',
    arguments: [11, 11],
    passIfEmpty: true,
    message: '电话 必须是 11位'
  })
]

exports.qqValidator = [
  validate({
    validator: 'isNumeric',
    passIfEmpty: true,
    message: 'qq 必须是数字'
  }),
  validate({
    validator: 'isLength',
    arguments: [6, 12],
    passIfEmpty: true,
    message: 'qq 必须是 6-12位'
  })
]

exports.avatarValidator = [
  validate({
    validator: 'isURL',
    passIfEmpty: true,
    message: '头像链接 格式不对'
  })
];