'use strict';
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('auth:auth-router');
const parseBasicAuth = require('../lib/parse-basic-auth');

const authController = require('../controller/auth-controller');
const authRouter = module.exports = new Router();


authRouter.post('/signup', bodyParser, function(req, res, next){
  debug('entered post sign-UP in auth-router.js');
  authController.signup(req.body)//should return a token
  .then(token => res.send(token))
  .catch(next);//next triggers the error middleware and passses it the error
});

authRouter.get('/signin', parseBasicAuth, function(req, res, next){
  debug('entered get sign-IN in auth-router.js');
  authController.signin(req.auth)//should return a token
  .then(token => res.send(token))
  .catch(next);//next triggers the error middleware and passses it the error
});
