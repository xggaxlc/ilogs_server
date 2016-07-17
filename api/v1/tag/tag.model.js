'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let TagSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, '标签名必填'],
    unique: true
  },
  create_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date
  }
});

TagSchema.plugin(uniqueValidator, {
  message: '{VALUE} 已经被使用'
});

module.exports = mongoose.model('Tag', TagSchema);