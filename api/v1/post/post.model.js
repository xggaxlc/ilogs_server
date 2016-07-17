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
  tags: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    validate: validator.TagsValidator
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