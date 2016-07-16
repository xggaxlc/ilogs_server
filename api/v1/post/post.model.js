'use strict';

const mongoose = require('mongoose');
const validator = require('validator');

let PostSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  summary: {
    type: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
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
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);