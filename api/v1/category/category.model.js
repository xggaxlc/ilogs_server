'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, '分类名必填'],
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

CategorySchema.plugin(uniqueValidator, {
  message: '{VALUE} 已经被使用'
});

module.exports = mongoose.model('Category', CategorySchema);