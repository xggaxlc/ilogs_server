'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('./user.validator');
const ValidateError = require('../../../components/utils.js').ValidateError;

let UserSchema = new mongoose.Schema({
  master: {
    type: Boolean,
    default: false
  },
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
    ref: 'Role'
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
  // master没有角色
  if (!this.role && !this.master) {
    next(new ValidateError('角色必填'));
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);