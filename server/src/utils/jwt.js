const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token.
 * @param {object} payload - Data to encode (e.g., { id, role })
 * @param {string} [expiresIn] - Override default expiry
 * @returns {string} Signed JWT token
 */
function generateToken(payload, expiresIn) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '7d',
  });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token - The JWT to verify
 * @returns {object} Decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
