const { verifyToken } = require('../utils/jwt');
const { AppError } = require('../utils/AppError');
const prisma = require('../config/db');

/**
 * Authenticate middleware — verifies JWT from Authorization header.
 * Attaches req.user = { id, role }.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Please provide a valid token.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Validate user still exists
    let user = null;
    if (decoded.role === 'patient') {
      user = await prisma.patient.findUnique({ where: { id: decoded.id } });
    } else if (decoded.role === 'doctor') {
      user = await prisma.doctor.findUnique({ where: { id: decoded.id } });
    } else if (decoded.role === 'admin') {
      user = await prisma.admin.findUnique({ where: { id: decoded.id } });
    }

    if (!user) {
      throw new AppError('User account no longer exists.', 401);
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please login again.', 401));
    }
    next(error);
  }
}

/**
 * Authorize middleware — checks if authenticated user has one of the allowed roles.
 * @param  {...string} roles - Allowed roles (e.g., 'patient', 'doctor', 'admin')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
