const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('User');

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
  },
  ((username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found',
        });
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong',
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }),
));

// passport.use(new GoogleStrategy({
//   clientID: process.env.GCP_CLIENT_ID ? process.env.GCP_CLIENT_ID : "68690114620-49b1oeghknmcus8onj9blofd4av2pr8i.apps.googleusercontent.com",
//   clientSecret: process.env.GCP_CLIENT_SECRET ? process.env.GCP_CLIENT_SECRET : "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",
//   callbackURL: process.env.GCP_CALLBACK_URL ? process.env.GCP_CALLBACK_URL : "http://localhost:4200/google/callback",
//   passReqToCallback   : true
// },
// function(request, accessToken, refreshToken, profile, done) {
//       return done(null, profile);
// }
// ));

// passport.use(new GoogleStrategy({
//   clientID:     GOOGLE_CLIENT_ID,
//   clientSecret: GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://yourdomain:3000/auth/google/callback",
//   passReqToCallback   : true
// },
// function(request, accessToken, refreshToken, profile, done) {
//   User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     return done(err, user);
//   });
// }
// ));
