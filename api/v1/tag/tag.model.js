'use strict';

const mongoose = require('mongoose');

let tagSchema = {
  name: {
    type: String,
    trim: true,
    unique: true
  }
}

module.exports = mongoose.model('Tag', tagSchema);