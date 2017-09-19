'use strict';

const mongoose = require('mongoose');

let SettingSchema = new mongoose.Schema({
  resetpass_link: {
    type: String,
    default: ''
  },
  resetpass_expire: {
    type: Number,
    default: 1 //单位 天
  },
  signup_link: {
    type: String,
    default: ''
  },
  signup_expire: {
    type: Number,
    default: 7 //单位 天
  },
  create_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date
  }
});

SettingSchema.pre('save', function(next) {
  this.update_at = Date.now();
  next();
});

module.exports = mongoose.model('Setting', SettingSchema);

const Log = require('../log/log.model');

SettingSchema.post('save', function() {
  if (global.currentUser) {
    new Log({
      name: global.currentUser._id,
      content: `更新了站点设置`
    }).save();
  }
});
