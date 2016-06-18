'use strict';
const Router = require('express').Router;
const bodyParser = require('body-parser').json();

const authController = require('../controller/auth-controller');
const authRouter = module.exports = new Router();

authRouter.post('./signup', bodyParser, function(req, res, next){
  authController.signup(req.body)//should return a token
  .then(token => res.send(token))
  .catch(next);//next triggers the error middleware and passses it the error
});
