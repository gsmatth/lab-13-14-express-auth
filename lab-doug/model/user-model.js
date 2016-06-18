'use strict';

const bcrypt = require('bcrypt');//generate hash
const crypto = require('crypto');//encrypt hash
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const debug = require('debug')('auth:user-model');
const httpErrors = require('http-errors');

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique:true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true}
});


/**
 * userSchema.methods.setHashedPassword - accepts input of plain text password  and generates a hash from that password using bcrypt.hash method.  The hash will be stored in place of the password property in that users database entry, preventing the plain text password from ever being stored in the database
 *
 * @param  {String} password plain text password
 * @return {String}          hashed password 
 */
userSchema.methods.setHashedPassword = function(password){
  debug('enterd userSchema.methods.setHashedPassword');
  return new Promise((resolve, reject) =>{
    bcrypt.hash(password, 10, (err, hash) => {
      if(err) return reject(err);
      this.password = hash;

      /**
       * 'this' is the instance of the user you are using now.  By using 'this' here, we will be able to chain methods after this resolves.
       */
      resolve(this);
    });
  });
};

userSchema.methods.compareHashedPassword = function (password) {
  debug('entered userSchema.methods.compareHashedPassword');
  return new Promise((resolve, reject) => {

    /**
     * 'this.password' is the hash we stored in place of the initial user provided plain-text password by using the setHash method above.  The 'result' parameter is a boolean value  provided as output by '.compare' method
     */
    bcrypt.compare(password, this.password, (err, result) => {
      if(err) return reject(err);
      if(!result) return reject(httpErrors(401, err.name));
      resolve(this);
    });
  });
};

userSchema.method.setFindHash = function(){
  debug('entered userSchema.method.setFindHash');
  return new Promise((resolve, reject)=> {
    var tries = 0;

    /**
     * 'call' invoked the preceding function and it sets the context for that function.  The context 'this' refers to the current instance of user.
     */
    _setFindHash.call(this);

    function _setFindHash(){
      this.findHash = crypto.randomBytes(128).toString('hex');

      /**
       * save will throw an error if the findHash we generated is not unique because we specified that property as 'unique:true' in our model.  The mongoose 'save' method returns user in this case and ew only return the findHash value of the user in the then block.
       */
      this.save()
      .then(() => resolve(this.findHash))
      .catch((err) => {
        if(tries > 10) reject(err);
        tries++;

        /**
         * when you re-call the method below, you need to provide the same context as when you originally called it at the top of the method.
         */
        _setFindHash.call(this);
      });
    }
  });
};

/**
 * userSchema.method.setToken - the only thing calling this function will be the setFindHash function when it wants to create a token for a user
 *
 * @return {String}  jwt generated token, which is the users encrypted findHash value
 */
userSchema.method.setToken = function(){
  debug('entered userSchema.method.setToken');
  return new Promise((resolve, reject) => {
    this.setFindHash()

    /**
     * we encrypt the findHash using jwt.sign method and our secret password set in env variable.
     */
    .then(findHash => resolve(jwt.sign({token: findHash}, process.env.APP_SECRET)))
    .catch(reject);
  });
};


/**
 * we place the export statement at the bottom so that the userSchema properties and methods exist before the export.
 */
module.exports = mongoose.model('user', userSchema);
