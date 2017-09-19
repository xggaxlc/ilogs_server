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
  md: {
    type: String
  },
  html: {
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
  if (global.currentUser) {
    if (global.reqMethod === 'POST') {
      new Log({
        name: global.currentUser._id,
        content: `创建了文章：${doc.title}`
      }).save();
    } else if (global.reqMethod === 'PUT') {
      new Log({
        name: global.currentUser._id,
        content: `更新了文章：${doc.title}`
      }).save();
    }
  }
});

PostSchema.post('remove', function(doc) {
  if (global.currentUser) {
    new Log({
      name: global.currentUser._id,
      content: `删除了文章：${doc.title}`
    }).save();
  }
});
