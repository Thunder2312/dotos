const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from 'Bearer <token>'

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;

