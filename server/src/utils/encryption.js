const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Get the encryption key buffer from the hex-encoded env variable.
 */
function getKey() {
  const keyHex = process.env.AES_ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error('AES_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
  }
  return Buffer.from(keyHex, 'hex');
}

/**
 * Encrypt an Aadhaar number using AES-256-GCM.
 * @param {string} plaintext - The Aadhaar number to encrypt
 * @returns {string} Encrypted string in format: iv:authTag:ciphertext (all hex)
 */
function encryptAadhaar(plaintext) {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt an AES-256-GCM encrypted Aadhaar string.
 * @param {string} encryptedStr - Format: iv:authTag:ciphertext (all hex)
 * @returns {string} Decrypted plaintext Aadhaar number
 */
function decryptAadhaar(encryptedStr) {
  const key = getKey();
  const [ivHex, authTagHex, ciphertext] = encryptedStr.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

module.exports = { encryptAadhaar, decryptAadhaar };
