var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.createAdmin = function(req) {

  var user = new User();

  user.name = req.name;
  user.email = req.email;
  user.admin = req.admin

  user.setPassword(req.password);
  user.save(function(err) {
    if (err) {
      console.error("Creating Admin Failed")
    }
    else
    {
      var token;
      token = user.generateJwt();
      console.log("Creating Admin User")
    }
  });

};

module.exports.setpwd = async function(req, res) {

  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "Password is required"
    });
    return;
  }
  const user = await User.findOne({email:req.body.email});
  user.setPassword(req.body.password);
  await user.save({validateModifiedOnly: true},function(err) {
    if (err) {
      console.log(err)
      sendJSONresponse(res, 400, {
        "message": "Error Updating Password"
      });
    }
    else
    {
      console.log("Updating User Password")
      res.status(200);
      res.json({
        "status" : "success"
      });
    }
  });

};


module.exports.register = function(req, res) {

  if(!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
  user.admin = req.body.admin

  user.setPassword(req.body.password);
  user.save(function(err) {
    if (err) {
      sendJSONresponse(res, 400, {
        "message": "User Already Exists"
      });
    }
    else
    {
      console.log("Creating User")
      var token;
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    }
  });

};

module.exports.login = function(req, res) {

  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  passport.authenticate('local', function(err, user, info){
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};