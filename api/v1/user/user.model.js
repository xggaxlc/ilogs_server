'use strict';

const mongoose = require('mongoose');
const validator = require('./user.validator');
const uniqueValidator = require('mongoose-unique-validator');

let UserSchema = new mongoose.Schema({
  master: {
    type: Boolean,
    default: false
  },
  changed: {
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

module.exports = mongoose.model('User', UserSchema);


// middleware
const ValidateError = require('../../../components/utils.js').ValidateError;
const Role = require('../role/role.model');

UserSchema.pre('save', function(next) {
  this.update_at = Date.now();
  if (!this.role) {
    if (!this.master) return next(new ValidateError('用户组必填'));
    // master没有角色
    next();
  } else {
   Role.findById(this.role).exec()
    .then(entity => {
      if (!entity) return next(new ValidateError('没有这个角色'));
      next();
    })
    .catch(err => {
      next(err);
    });
  }
});