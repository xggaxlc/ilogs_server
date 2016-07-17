'use strict';

const validate = require('mongoose-validator');

exports.TagsValidator = [
  validate({
    validator: function(arr) {
      return arr.length <= 5;
    },
    message: '最多设置 5个标签'
  }),
  validate({
    validator: function(arr) {
      let sortedArr = arr.sort();
      for (let i = 0; i < arr.length; i++) {
        try {
          if (sortedArr[i].toString() === sortedArr[i + 1].toString()) {
            return false;
          }
        } catch (e) {}
      }
      return true;
    },
    message: '不要重复设置标签'
  })
];

exports.titleValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 80],
    message: '标题 不能大于 {ARGS[1]} 个字符'
  })
];