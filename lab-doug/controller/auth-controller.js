'use strict';

const debug = require('debug')('auth:auth-controller');
const User = require('../lib/user-model');

exports.signup = function(reqBody){
  debug('entered signup function in auth-controller.js');
  return new Promise((resolve, reject)=> {

    /**
     * you do not ever want to store the password that the user provides when they sign-up.  We want to replace the password with they hashed password before saving the user to the database as par tof the sign-up process
     */
    var password = reqBody.password;
    delete reqBody.password;
    var user = new User(reqBody);
    user.setHashedPassword(password)
    .then(user => user.save())
    .then(user => user.SetToken())
    .then(token => resolve(token))
    .catch(reject);
  });
};
