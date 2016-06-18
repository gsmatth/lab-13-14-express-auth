'use strict';

const debug = require('debug')('auth:auth-controller');
const User = require('../lib/user-model');

exports.signup = function(reqBody){
  debug('entered signup function in auth-controller.js');
  return new Promise((resolve, reject)=> {
    var password = reqBody.password;
    delete reqBody.password;
    var user = new User(reqBody);
    user setHash(password)
    .then
  });
}
