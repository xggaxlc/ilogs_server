const User = require('./user.model');
const utils = require('../../../components/utils');

//密码sha256
User.schema.pre('save', function(next) {
  this.password = utils.cryptoPass(this.password);
  next();
});