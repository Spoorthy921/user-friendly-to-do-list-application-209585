class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

class ValidationError extends ApiError {
  constructor(message, details) {
    super(400, message || 'Validation error', details);
    this.name = 'ValidationError';
  }
}

class UnauthorizedError extends ApiError {
  constructor(message) {
    super(401, message || 'Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends ApiError {
  constructor(message) {
    super(403, message || 'Forbidden');
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(404, message || 'Not found');
    this.name = 'NotFoundError';
  }
}

/**
 * Express error-handling middleware.
 */
// PUBLIC_INTERFACE
function errorHandler(err, req, res, next) {
  /** Normalize errors into a consistent JSON response. */
  // eslint-disable-next-line no-unused-vars
  const _next = next;

  const statusCode = err.statusCode || 500;

  // Avoid leaking stack traces in production
  const isProd = (process.env.NODE_ENV || 'development') === 'production';

  const payload = {
    status: 'error',
    message: err.message || 'Internal Server Error',
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (!isProd && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  errorHandler,
};
