const { decryptAadhaar } = require('./encryption');

/**
 * Mask an Aadhaar number to show only the last 4 digits.
 * Input can be an encrypted string or plaintext 12-digit number.
 * @param {string} aadhaarEncrypted - AES-encrypted Aadhaar string (iv:authTag:ciphertext)
 * @returns {string} Masked Aadhaar like "XXXX-XXXX-1234"
 */
function maskAadhaar(aadhaarEncrypted) {
  try {
    const plaintext = decryptAadhaar(aadhaarEncrypted);
    const last4 = plaintext.slice(-4);
    return `XXXX-XXXX-${last4}`;
  } catch {
    return 'XXXX-XXXX-XXXX';
  }
}

module.exports = { maskAadhaar };
