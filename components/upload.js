'use strict';

const multer = require('multer');
const mkdirp = require('mkdirp');
const config = require('../config/environment');
const path = require('path');
const Q = require('q');
const fs = require('fs');

// folderName , limits , fileFilter
exports.createUpload = function(opts) {
  let dir = path.join(__dirname, `../${config.upload.folderName}`, opts.folderName);
  let storage = multer.diskStorage({
    destination: function(req, file, cb) {
      mkdirp(dir, function(err) {
        if (err) return console.error(err);
        cb(null, dir);
      });
    },
    filename: function(req, file, cb) {
      let ext = file.originalname.split('.').pop();
      let fileName = ext ? `${file.fieldname}-${Date.now()}.${ext}` : `${file.fieldname}-${Date.now()}`;
      cb(null, fileName);
    }
  });

  return multer({
    storage: storage,
    limits: opts.limits || {
      fileSize: config.upload.maxSize * 1024 * 1024,
      files: 10
    },
    fileFilter: opts.fileFilter || function(req, file, cb) {
      if (! (file.mimetype.indexOf('image/') === 0)) return cb('不支持的格式', false);
      cb(null, true);
    }
  });
}

exports.createLimitError = function(errCode) {

  let errorMessages = {
    'LIMIT_PART_COUNT': 'Too many parts',
    'LIMIT_FILE_SIZE': '图片太大了',
    'LIMIT_FILE_COUNT': 'Too many files',
    'LIMIT_FIELD_KEY': 'Field name too long',
    'LIMIT_FIELD_VALUE': 'Field value too long',
    'LIMIT_FIELD_COUNT': 'Too many fields',
    'LIMIT_UNEXPECTED_FILE': 'name 字段名错误'
  }

  return errorMessages[errCode.toUpperCase()];
}

exports.deleteFile = function(folderName, fileName) {
  let defferd = Q.defer();
  let filePath = path.join(__dirname, `../${config.upload.folderName}`, folderName, fileName);

  fs.unlink(filePath, err => {
    if (err)  {
      defferd.reject(err);
    } else {
      defferd.resolve();
    }
  });

  return defferd.promise;

}