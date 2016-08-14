'use strict';

const upload = require('../../../components/upload');
const config = require('../../../config/environment');
const Q = require('q');
const _ = require('lodash');

exports.avatar = function(req, res) {
  let opts = {
    folderName: 'avatar'
  }

  let uploader = upload.createUpload(opts).single('avatar');

  uploader(req, res, err => {
    if (err) 
    return err.code ? res.json({
      success: 0,
      message: upload.createLimitError(err.code)
    }) : res.json({
      success: 0,
      message: err
    });

    if (!req.file) return res.json({
      success: 0,
      message: '上传的图片不能为空！'
    });

    res.json({
      succss: 1,
      url: `${config.host}/${config.upload.folderName}/${opts.folderName}/${req.file.filename}`,
      message: '上传成功！'
    });

  });
}

exports.deteteAvatar = function(req, res) {
  let filename = req.params.filename;
  upload.deleteFile('avatar', filename)
    .then(() => {
      res.json({
        success: 1,
        message: '删除图片成功!'
      })
    })
    .catch(err => {
      res.json({
        success: 0,
        error: err,
        message: '删除失败，可能没有这个文件'
      });
    });
}