const express = require('express');

const router = express.Router();
const jwt = require('express-jwt');

const auth = jwt({
  secret: process.env.AUTH_SECRET ? process.env.AUTH_SECRET : 'MY_SECRET',
  userProperty: 'payload',
  algorithms: ['sha1', 'RS256', 'HS256'],
});

const ctrlProfile = require('../controllers/profile');
const ctrlAuth = require('../controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/setpwd', ctrlAuth.setpwd);

module.exports = router;
