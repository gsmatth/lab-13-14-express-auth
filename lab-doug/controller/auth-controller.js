'use strict';

const debug = require('debug')('auth:auth-controller');
const User = require('../model/user-model');


/**
 * auth-controller.signup - takes the reqbody of a user signup request and creates user in database. The user provided password, is hashed before storing the hashed password  in the password property of the user.  A unique findHash value is created when you call .setToken method and that function calls .setFindHash method. A unique user token is then created by encrypting the user's findhash value within .setToken method.
 *
 * @param  {Object} reqBody req.body that contains the password property
 * @return {String}         returns the encrypted findHash value as a 'token'
 */
exports.signup = function(reqBody){
  debug('entered sign-UP function in auth-controller.js');
  return new Promise((resolve, reject)=> {
    var password = reqBody.password;
    delete reqBody.password;
    var user = new User(reqBody);
    user.setHashedPassword(password)
    .then(user => user.save())
    .then(user => user.setToken())
    .then(token => resolve(token))
    .catch(err => reject(err));
  });
};


/**
 * auth-controller.signin - accesses the authorization header of a user's signin request and uses it to verify the user exists in the database. If user exists, leverage bcrypt.compare method to hash the password provided by the user in the request.  It then uses bcrypt.compare method to compare the newly hashed password with the users hashed password stored in the database. If the two hash passwords match, a token will be created for the user by generating a new findHash value and encrypting the findHash value with .setToken method.  The token will be returned to the client for use in this session.
 *
 * @param  {type} auth description
 * @return {String}      token which contains the users encrypted findHash value
 */
exports.signin = function(auth){
  debug('entered sign-IN function in auth-controller.js');
  return new Promise((resolve, reject) => {
    User.findOne({username: auth.username})
    .then((user => user.compareHashedPassword(auth.password)))
    .then(user => user.setToken())
    .then(token => resolve(token))
    .catch(err => reject(err));
  });
};
