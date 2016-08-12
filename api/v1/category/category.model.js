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

CategorySchema.pre('save', function(next) {
  this.update_at = Date.now();
  next();
});

module.exports = mongoose.model('Category', CategorySchema);