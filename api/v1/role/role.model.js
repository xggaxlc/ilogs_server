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
const Q = require('q');

RoleSchema.pre('save', function(next) {
  this.update_at = Date.now();
  next();
});

RoleSchema.pre('remove', function(next) {
  User.findOne({
      role: this._id
    }).exec()
    .then(entity => {
      if (entity) return next(new ValidateError('有用户使用此用户组,无法删除'));
      next();
    })
    .catch(err => {
      next(err);
    });
});

RoleSchema.post('save', function(doc) {
  if (global.currentUser) {
    if (global.reqMethod === 'POST') {
      new Log({
        name: global.currentUser._id,
        content: `创建了角色：${doc.name}`
      }).save();
    } else if (global.reqMethod === 'PUT') {
      let newLog = new Log({
        name: global.currentUser._id,
        content: `更新了角色：${doc.name}`
      });
      Q.all([
          // 记录Log
          newLog.save(),
          // role修改下线所有此角色的用户
          User.update({
            role: doc._id
          }, {
            $set: {
              changed: true
            }
          }, {
            multi: true
          })
        ])
        .catch(err => {
          console.error(err);
        });
    }
  }
});

RoleSchema.post('remove', function(doc) {
  if (global.currentUser) {
    new Log({
      name: global.currentUser._id,
      content: `删除了角色：${doc.name}`
    }).save();
  }
});
