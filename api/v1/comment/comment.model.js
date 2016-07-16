'use strict';

const mongoose = require('mongoose');

let CommentSchema = new mongoose.Schema({
  create_at: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String
  }
});

module.exports = mongoose.model('Comment', CommentSchema);