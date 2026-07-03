const jwt = require('jsonwebtoken');

// This middleware protects routes. It runs BEFORE the route handler.
// It reads the "Authorization: Bearer <token>" header, verifies the JWT,
// and attaches the decoded user id to req.userId so route handlers know
// which user is making the request.
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, access denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next(); // token is valid, let the request continue to the actual route
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
