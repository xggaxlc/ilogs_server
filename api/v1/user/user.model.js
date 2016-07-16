'use strict';

const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  sex: Boolean,
  tel: Number,
  qq: Number,
  avatar: {
    type: String
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

module.exports = mongoose.model('User', UserSchema);