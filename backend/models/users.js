var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var uniqueValidator = require('mongoose-unique-validator')

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function(value) {
          const self = this;
          const errorMsg = 'Email already in use!';
          return new Promise((resolve, reject) => {
              self.constructor.findOne({ email: value })
                  .then(model => model._id ? reject(new Error(errorMsg)) : resolve(true)) // if _id found then email already in use 
                  .catch(err => resolve(true)) // make sure to check for db errors here
          });
      },
    }
  },
  name: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true
  },
  hash: String,
  salt: String
},{timestamps: true});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    admin: this.admin,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.AUTH_SECRET ? process.env.AUTH_SECRET: "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};
userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema);