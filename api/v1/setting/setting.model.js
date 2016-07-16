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


module.exports = mongoose.model('Setting', SettingSchema);