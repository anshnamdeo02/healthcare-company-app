const transporter = require('../config/email');

/**
 * Send a structured HTML email to the company when a new patient registers.
 */
async function sendPatientRegistrationEmail(patientData) {
  const { name, age, gender, mobile, email, address, emergencyContact, aadhaarMasked } = patientData;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7fa; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0d9488, #0891b2); color: white; padding: 24px 32px; }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 4px 0 0; opacity: 0.9; font-size: 14px; }
        .body { padding: 24px 32px; }
        .field { display: flex; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
        .label { font-weight: 600; color: #374151; width: 160px; min-width: 160px; }
        .value { color: #6b7280; }
        .footer { padding: 16px 32px; background: #f9fafb; text-align: center; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 New Patient Registration</h1>
          <p>A new patient has registered on the platform</p>
        </div>
        <div class="body">
          <div class="field"><span class="label">Full Name</span><span class="value">${name}</span></div>
          <div class="field"><span class="label">Age</span><span class="value">${age}</span></div>
          <div class="field"><span class="label">Gender</span><span class="value">${gender}</span></div>
          <div class="field"><span class="label">Mobile</span><span class="value">${mobile}</span></div>
          <div class="field"><span class="label">Email</span><span class="value">${email}</span></div>
          <div class="field"><span class="label">Address</span><span class="value">${address}</span></div>
          <div class="field"><span class="label">Emergency Contact</span><span class="value">${emergencyContact}</span></div>
          <div class="field"><span class="label">Aadhaar</span><span class="value">${aadhaarMasked}</span></div>
        </div>
        <div class="footer">
          <p>Healthcare Company — Automated Notification System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Healthcare App" <${process.env.SMTP_USER}>`,
    to: process.env.COMPANY_EMAIL,
    subject: `New Patient Registration — ${name}`,
    html,
  });
}

/**
 * Send a structured HTML email to the company when a new doctor registers.
 */
async function sendDoctorRegistrationEmail(doctorData) {
  const {
    name, specialization, registrationNumber, registrationState,
    hospital, experience, patientsTreated, photoUrl, certificateUrl,
  } = doctorData;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7fa; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 24px 32px; }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 4px 0 0; opacity: 0.9; font-size: 14px; }
        .body { padding: 24px 32px; }
        .field { display: flex; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
        .label { font-weight: 600; color: #374151; width: 160px; min-width: 160px; }
        .value { color: #6b7280; }
        .docs { margin-top: 16px; }
        .docs a { display: inline-block; margin-right: 12px; padding: 8px 16px; background: #4f46e5; color: white; border-radius: 6px; text-decoration: none; font-size: 14px; }
        .footer { padding: 16px 32px; background: #f9fafb; text-align: center; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🩺 New Doctor Registration</h1>
          <p>A new doctor has submitted a registration request (PENDING APPROVAL)</p>
        </div>
        <div class="body">
          <div class="field"><span class="label">Doctor Name</span><span class="value">${name}</span></div>
          <div class="field"><span class="label">Specialization</span><span class="value">${specialization}</span></div>
          <div class="field"><span class="label">Reg. Number</span><span class="value">${registrationNumber}</span></div>
          <div class="field"><span class="label">Reg. State</span><span class="value">${registrationState}</span></div>
          <div class="field"><span class="label">Hospital</span><span class="value">${hospital}</span></div>
          <div class="field"><span class="label">Experience</span><span class="value">${experience} years</span></div>
          <div class="field"><span class="label">Patients Treated</span><span class="value">${patientsTreated}</span></div>
          <div class="docs">
            <p style="font-weight: 600; color: #374151;">Uploaded Documents:</p>
            ${photoUrl ? `<a href="${photoUrl}" target="_blank">📷 View Photo</a>` : ''}
            ${certificateUrl ? `<a href="${certificateUrl}" target="_blank">📄 View Certificate</a>` : ''}
          </div>
        </div>
        <div class="footer">
          <p>Healthcare Company — Automated Notification System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Healthcare App" <${process.env.SMTP_USER}>`,
    to: process.env.COMPANY_EMAIL,
    subject: `New Doctor Registration — ${name} (${specialization})`,
    html,
  });
}

/**
 * Send a password reset email to a patient.
 */
async function sendPasswordResetEmail(to, resetLink) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7fa; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0d9488, #0891b2); color: white; padding: 24px 32px; }
        .body { padding: 24px 32px; text-align: center; }
        .btn { display: inline-block; margin-top: 16px; padding: 12px 32px; background: #0d9488; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; }
        .footer { padding: 16px 32px; background: #f9fafb; text-align: center; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="body">
          <p>You requested a password reset. Click the button below to set a new password.</p>
          <a class="btn" href="${resetLink}">Reset Password</a>
          <p style="margin-top: 20px; color: #9ca3af; font-size: 13px;">This link expires in 15 minutes. If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Healthcare Company — Automated Notification System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Healthcare App" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Password Reset — Healthcare App',
    html,
  });
}

module.exports = {
  sendPatientRegistrationEmail,
  sendDoctorRegistrationEmail,
  sendPasswordResetEmail,
};
