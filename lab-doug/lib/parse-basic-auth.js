'use strict';

const httpErrors = require('http-errors');
const debug = require('debug')('auth:parse-basic-debug');

module.exports = function(req, res, next){
  debug('calling the parse-basic-auth function');
  if(!req.headers.authorization)
    return next(httpErrors('401', 'request does not contain a authorization header'));
  var authHeader = req.headers.authorization;//base64 encoded
  var authHeaderNamePassword = authHeader.split(' ')[1];//generate array with auth header components and select base64 encoded string in index 1
  var namePasswordDecoded = new Buffer(authHeaderNamePassword, 'base64').toString('utf8'); //decode and the output is 'billy:myeasypassword'
  var namePassword = namePasswordDecoded.split(':');
  req.auth = {
    username: namePassword[0],
    password: namePassword[1]
  };
  if(!req.auth.username) return next(httpErrors(401, 'no username provided'));
  if(!req.auth.password) return next(httpErrors(401, 'no password provided'));
  next();
};
