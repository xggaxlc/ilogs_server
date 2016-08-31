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

const Log = require('../log/log.model');

CategorySchema.pre('save', function(next) {
  this.update_at = Date.now();
  next();
});

CategorySchema.post('save', function(doc) {
  let newLog = new Log({
    name: global.currentUser._id,
    content: `创建或者更新了[分类]--${doc.name}`
  });
  newLog.save();
});

CategorySchema.post('remove', function(doc) {
  let newLog = new Log({
    name: global.currentUser._id,
    content: `删除了[分类]--${doc.name}`
  });
  newLog.save();
});