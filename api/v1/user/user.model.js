'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('./user.validator');

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, '姓名必填'],
    validate: validator.nameValidator
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, '邮箱必填'],
    validate: validator.emailValidator
  },
  password: {
    type: String,
    required: [true, '密码必填']
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, '用户组必填'],
  },
  sex: Boolean,
  tel: {
    type: Number,
    validate: validator.telValidator
  },
  qq: {
    type: Number,
    validate: validator.qqValidator
  },
  avatar: {
    type: String,
    validate: validator.avatarValidator
  },
  remark: String,
  create_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date,
    default: Date.now
  },
  last_login_at: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  },
  retrieve_time: Number,
  retrieve_key: String
});


UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} 已经被使用'
});

UserSchema.pre('save', function(next) {
  this.update_at = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);