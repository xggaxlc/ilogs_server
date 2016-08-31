'use strict';

const mongoose = require('mongoose');
const validator = require('./post.validator');

let PostSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, '标题必填'],
    validate: validator.titleValidator
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '作者必填']
  },
  content: {
    type: String
  },
  cover: {
    type: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  summary: {
    type: String
  },
  hits: {
    type: Number,
    default: 0
  },
  published: {
    type: Boolean,
    default: false
  },
  create_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date
  },
  publish_at: {
    type: Date
  },
  update_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Post', PostSchema);

const Log = require('../log/log.model');

PostSchema.pre('save', function(next) {
  this.update_at = Date.now();
  next();
});

PostSchema.post('save', function(doc) {
  let newLog = new Log({
    name: global.currentUser._id,
    content: `创建或者更新了[文章]--${doc.title}`
  })
  newLog.save();
});

PostSchema.post('remove', function(doc) {
  let newLog = new Log({
    name: global.currentUser._id,
    content: `删除了[文章]--${doc.title}`
  });
  newLog.save();
});

