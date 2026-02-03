const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errorHandler');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Required for auth endpoints
    throw new Error('Missing required env var JWT_SECRET');
  }
  return secret;
}

// PUBLIC_INTERFACE
function requireAuth(req, res, next) {
  /** Require a valid Bearer JWT; attaches req.user = { id, email } */
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }

    const payload = jwt.verify(token, getJwtSecret());

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    return next();
  } catch (err) {
    // jwt throws errors; normalize to 401
    return next(new UnauthorizedError('Invalid or expired token'));
  }
}

module.exports = { requireAuth };
