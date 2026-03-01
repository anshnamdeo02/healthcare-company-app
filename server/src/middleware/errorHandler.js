/**
 * Centralized error handling middleware.
 * Must be registered LAST in the middleware chain (4 arguments).
 */
function errorHandler(err, req, res, next) {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Prisma known errors
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large. Maximum size is 5MB.';
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field.';
  }

  // JWT errors (fallback)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired.';
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      statusCode,
      message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
