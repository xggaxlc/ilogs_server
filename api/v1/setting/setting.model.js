'use strict';

const mongoose = require('mongoose');

let SettingSchema = new mongoose.Schema({
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