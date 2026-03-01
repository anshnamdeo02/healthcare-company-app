const { AppError } = require('../utils/AppError');

/**
 * Middleware factory that validates req.body against a Zod schema.
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    // Replace body with parsed/transformed data
    req.body = result.data;
    next();
  };
}

module.exports = { validate };
