const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const usersRepo = require('../repositories/users');
const { ValidationError, UnauthorizedError } = require('../middleware/errorHandler');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing required env var JWT_SECRET');
  }
  return secret;
}

function getJwtTtlSeconds() {
  const ttl = Number.parseInt(process.env.JWT_EXPIRES_IN_SECONDS || '604800', 10); // default 7 days
  return Number.isNaN(ttl) ? 604800 : ttl;
}

function sanitizeUser(user) {
  return {
    id: user._id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function signToken(user) {
  const ttlSeconds = getJwtTtlSeconds();
  const token = jwt.sign(
    { email: user.email },
    getJwtSecret(),
    {
      subject: user._id,
      expiresIn: ttlSeconds,
    }
  );
  return token;
}

// PUBLIC_INTERFACE
async function register({ email, password }) {
  /** Register a new user and return { user, token }. */
  const existing = await usersRepo.findUserByEmail(email);
  if (existing) {
    throw new ValidationError('Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    _id: randomUUID(),
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await usersRepo.createUser(user);

  return {
    user: sanitizeUser(user),
    token: signToken(user),
  };
}

// PUBLIC_INTERFACE
async function login({ email, password }) {
  /** Login and return { user, token }. */
  const user = await usersRepo.findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new UnauthorizedError('Invalid email or password');
  }

  return {
    user: sanitizeUser(user),
    token: signToken(user),
  };
}

// PUBLIC_INTERFACE
async function me(userId) {
  /** Return user info for current user. */
  const user = await usersRepo.findUserById(userId);
  if (!user) {
    throw new UnauthorizedError('User not found');
  }
  return sanitizeUser(user);
}

module.exports = {
  register,
  login,
  me,
};
