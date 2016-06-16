'use strict'
//npm modules
const express = require('express');
const morgan = require('morgan');
const debug = require('debug');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');

//app modules
//routes

//module constants
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/auth';

const app = express();
mongoose.connect(mongoURI);

app.use(httpErrors);
app.use(morgan);

app.all('*', function(req, res){
  debug('this route is not registered');
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('express app up on port: ', port);
});

server.isRunning = true;
module.exports = server;
