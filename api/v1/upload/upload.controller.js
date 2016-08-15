'use strict';

const upload = require('../../../components/upload');
const config = require('../../../config/environment');
const Q = require('q');
const _ = require('lodash');


function uploadSingleFile(req, res, fieldName) {
  let opts = {
    folderName: fieldName
  }
  let uploader = upload.uploadImage(opts).single(opts.folderName);
  let deferred = Q.defer();

  uploader(req, res, err => {
    if (err)
      return err.code ? deferred.reject({
        message: upload.createLimitError(err.code)
      }) : deferred.reject({
        message: err
      });

    if (!req.file)
      return deferred.reject({
        message: '上传的图片不能为空！'
      });

    deferred.resolve({
      url: `${config.host}/${config.upload.folderName}/${opts.folderName}/${req.file.filename}`,
      message: '上传成功！'
    });
  });
  return deferred.promise;

}

exports.uploadImage = function(req, res) {
  uploadSingleFile(req, res, 'image')
    .then(successInfo => {
      res.json(_.merge({
        success: 1
      }, successInfo));
    })
    .catch(errorInfo => {
      res.json(_.merge({
        success: 0
      }, errorInfo));
    });
}


exports.destroy = function(req, res) {
  upload.deleteFile(req.params.filename)
    .then(() => {
      res.json({
        success: 1,
        message: '删除文件成功!'
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