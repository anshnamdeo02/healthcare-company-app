const multer = require('multer');
const { AppError } = require('../utils/AppError');

// Memory storage — files held as buffers for manual Cloudinary upload
const storage = multer.memoryStorage();

// File filter: only allow jpg, png, pdf
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPG, PNG, and PDF are allowed.', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

/**
 * Middleware for doctor file uploads (photo + certificate).
 */
const doctorUpload = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
]);

module.exports = { upload, doctorUpload };
