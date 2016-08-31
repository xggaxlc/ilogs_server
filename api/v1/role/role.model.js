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
    invite: {
      post: {
        type: Boolean,
        default: false
      }
    },
    upload: {
      delete: {
        type: Boolean,
        default: true
      }
    },
    setting: {
      get: {
        type: Boolean,
        default: false
      },
      post: {
        type: Boolean,
        default: false
      }
    },
    post: {
      put: {
        type: Boolean,
        default: false
      },
      delete: {
        type: Boolean,
        default: false
      }
    },
    category: {
      post: {
        type: Boolean,
        default: true
      },
      put: {
        type: Boolean,
        default: false
      },
      delete: {
        type: Boolean,
        default: false
      }
    },
    user: {
      post: {
        type: Boolean,
        default: false
      },
      put: {
        type: Boolean,
        default: false
      },
      delete: {
        type: Boolean,
        default: false
      }
    },
    role: {
      post: {
        type: Boolean,
        default: false
      },
      put: {
        type: Boolean,
        default: false
      },
      delete: {
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

module.exports = mongoose.model('Role', RoleSchema);

// middleware
const ValidateError = require('../../../components/utils.js').ValidateError;
const User = require('../user/user.model');
const Log = require('../log/log.model');

RoleSchema.pre('save', function(next) {
  this.update_at = Date.now();
  next();
});

RoleSchema.pre('remove', function(next) {
  User.findOne({ role: this._id }).exec()
    .then(entity => {
      if (entity) return next(new ValidateError('有用户使用此用户组,无法删除')); 
      next();
    })
    .catch(err => {
      next(err);
    });
});

RoleSchema.post('save', function(doc) {
  let newLog = new Log({
    name: global.currentUser._id,
    content: `创建或者更新了[角色]--${doc.name}`
  })
  newLog.save();
});

RoleSchema.post('remove', function(doc) {
  let newLog = new Log({
    name: global.currentUser._id,
    content: `删除了[角色]--${doc.name}`
  });
  newLog.save();
});