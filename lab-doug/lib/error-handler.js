'use strict';

const debug = require('debug')('auth:error-handler');
const httpErrors = require('http-errors');

module.exports = function(err, req, res, next){
  console.error(err.message);
  if(err.status && err.name){
    res.status(err.status).send(err.name);
    next();
    return;
  }

  /**
   * for errors that fall through the code above (meaning they do not have one of the error status and err.messages included in http-errors middleware), a new error will be created using httpErr below.  It will have a code of 500 and err.message content from the http-errors middleware
   */
  debug('fall through 500 error being called in error-handler.js');
  err = httpErrors(500, err.message);
  res.status(err.status).send(err.name);
};
