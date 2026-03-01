const adminService = require('../services/admin.service');
const doctorService = require('../services/doctor.service');

async function login(req, res, next) {
  try {
    const result = await adminService.loginAdmin(req.body.email, req.body.password);
    res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function approveDoctor(req, res, next) {
  try {
    const result = await doctorService.approveDoctor(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Doctor approved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getDoctors(req, res, next) {
  try {
    const result = await adminService.getDoctors(req.query.status);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  approveDoctor,
  getDoctors,
};
