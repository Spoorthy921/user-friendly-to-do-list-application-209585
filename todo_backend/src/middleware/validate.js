const { validationResult } = require('express-validator');
const { ValidationError } = require('./errorHandler');

// PUBLIC_INTERFACE
function validate(req, res, next) {
  /** Express middleware that returns 400 if express-validator found errors. */
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(
      new ValidationError('Invalid request', {
        errors: result.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      })
    );
  }
  return next();
}

module.exports = { validate };
