'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, '角色名必填']
  },
  active: {
    type: Boolean,
    default: true
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
      }
    },
    setting: {
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
  }
});

RoleSchema.plugin(uniqueValidator, {
  message: '{VALUE} 已经被使用'
});

RoleSchema.pre('save', function(next) {
  this.update_at = Date.now();
  next();
});

module.exports = mongoose.model('Role', RoleSchema);