'use strict';
//npm modules
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('auth:server');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');

//app modules
const errorHandler = require('./lib/error-handler');
//routes

//module constants
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/auth';


mongoose.connect(mongoURI);

// app.use(httpErrors);
app.use(morgan('dev'));

//routes
app.all('*', function(req, res, next){
  debug('this route is not registered');
  /**
   * We create a new error using http-errors module and include it as the argument passed in next.
   * By calling next with an error, we trigger the errorHandler middleware module to handle this error
   */
  next(httpErrors(404, 'this route is not registered'));



});

app.use(errorHandler);

const server = app.listen(port, function(){
  debug('listen');
  debug('express app up on port: ', port);
});

server.isRunning = true;
module.exports = server;

//DEBUG=auth* node server.js
