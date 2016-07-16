'use strict';

const mongoose = require('mongoose');

let tagSchema = {
  name: {
    type: String,
    trim: true,
    unique: true
  },
  create_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date
  }
}

module.exports = mongoose.model('Tag', tagSchema);