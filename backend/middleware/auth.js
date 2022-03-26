const jwt = require('jsonwebtoken');

const config = process.env;

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.AUTH_SECRET ? process.env.AUTH_SECRET : 'MY_SECRET', (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

module.exports = auth;
