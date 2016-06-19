'use strict';

const debug = require('debug')('auth:user-controller');
const User = require('../model/user-model');

exports.removeAllUsers = function(){
  debug('entered removeAllUsers in user-controller.js');
  return User.remove({});
};
