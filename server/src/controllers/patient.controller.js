const patientService = require('../services/patient.service');

async function signup(req, res, next) {
  try {
    const patient = await patientService.signupPatient(req.body);
    res.status(201).json({
      success: true,
      message: 'Patient registered successfully.',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await patientService.loginPatient(req.body.email, req.body.password);
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    await patientService.forgotPassword(req.body.email);
    // Always return success to prevent email enumeration
    res.status(200).json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    await patientService.resetPassword(req.body.token, req.body.password);
    res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
    });
  } catch (error) {
    next(error);
  }
}

async function dashboard(req, res, next) {
  try {
    const data = await patientService.getDashboard(req.user.id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function prescriptions(req, res, next) {
  try {
    const data = await patientService.getPrescriptions(req.user.id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function followups(req, res, next) {
  try {
    const data = await patientService.getFollowups(req.user.id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  dashboard,
  prescriptions,
  followups,
};
