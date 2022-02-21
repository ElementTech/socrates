var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.AUTH_SECRET ? process.env.AUTH_SECRET: "MY_SECRET",
  userProperty: 'payload',
  algorithms: ['sha1', 'RS256', 'HS256']
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/setpwd', ctrlAuth.setpwd);

module.exports = router;
