'use strict';

const mongoose = require('mongoose');

let categorySchema = {
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

module.exports = mongoose.model('Category', categorySchema);