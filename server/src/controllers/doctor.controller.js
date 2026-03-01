const doctorService = require('../services/doctor.service');

async function signup(req, res, next) {
  try {
    const doctor = await doctorService.signupDoctor(req.body, req.files);
    res.status(201).json({
      success: true,
      message: 'Doctor registration submitted successfully. Your account is pending admin approval.',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await doctorService.loginDoctor(req.body.email, req.body.password);
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function dashboard(req, res, next) {
  try {
    const result = await doctorService.getDoctorDashboard(req.user.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
  dashboard,
};
