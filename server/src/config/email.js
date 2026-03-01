const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: parseInt(process.env.SMTP_PORT, 10) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection on startup (non-blocking)
transporter.verify().then(() => {
  console.log('✅ SMTP connection verified');
}).catch((err) => {
  console.warn('⚠️  SMTP connection failed (emails will not send):', err.message);
});

module.exports = transporter;
