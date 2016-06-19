'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'mysecretcypherkeystringsdi';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

const expect = require('chai');
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('auth:auth-router-test');
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');
const port = process.env.PORT || 3000;
const baseURL = `localhost:${port}/api`;
const server = require('../server');

request.use(superPromise);


describe('Testing the auth-router', function(){
  before((done) => {
    debug('entered top "before" block in auth-router-test');
    if(!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server is running on port: ', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('entered top "after" block in auth-router-test');
    if(server.isRunning){
      server.close(() => {
        console.log('server has been shutdown');
        server.isRunning = false;
        done();
      });
      return;
    }
    done();
  });

  describe(', testing POST signup route /api/signup', function(){
    debug('entered POST /api/signup test in auth-router.js');
    after((done) => {
      debug('entered "after" in POST /api/signup test in auth-router.js');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a token', function(done){
      debug('enterd first it statement in POST signup router, auth-router.js');
      request.post(`${baseURL}/signup`)
      .send({
        username: 'Bobbytestname',
        password: 'testpassword'
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      });
    });
  });




});
