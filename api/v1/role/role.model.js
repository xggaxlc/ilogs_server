'use strict';

const mongoose = require('mongoose');

let RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  permissions: {
    category: {
      delete: {
        type: Boolean,
        default: false
      },
      put: {
        type: Boolean,
        default: false
      },
      post: {
        type: Boolean,
        default: false
      },
      get: {
        type: Boolean,
        default: true
      }
    },
    tag: {
      delete: {
        type: Boolean,
        default: false
      },
      put: {
        type: Boolean,
        default: false
      },
      post: {
        type: Boolean,
        default: false
      },
      get: {
        type: Boolean,
        default: true
      }
    },
    post: {
      delete: {
        type: Boolean,
        default: false
      },
      put: {
        type: Boolean,
        default: false
      },
      post: {
        type: Boolean,
        default: false
      },
      get: {
        type: Boolean,
        default: true
      }
    },
    user: {
      delete: {
        type: Boolean,
        default: false
      },
      put: {
        type: Boolean,
        default: false
      },
      post: {
        type: Boolean,
        default: false
      },
      get: {
        type: Boolean,
        default: true
      }
    },
    role: {
      delete: {
        type: Boolean,
        default: false
      },
      put: {
        type: Boolean,
        default: false
      },
      post: {
        type: Boolean,
        default: false
      },
      get: {
        type: Boolean,
        default: false
      }
    }
  },
  create_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Role', RoleSchema);