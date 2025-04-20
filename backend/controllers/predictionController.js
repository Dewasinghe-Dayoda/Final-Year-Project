const multer = require('multer');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Convert fs.unlink to promise-based for async/await
const unlinkFile = util.promisify(fs.unlink);

// Configure multer for temporary image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Allow only single file upload
  }
});

/**
 * Clean up uploaded files (sync version)
 * @param {string} filePath - Path to the file to be deleted
 */
const cleanupFile = (filePath) => {
  if (!filePath) return;
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Error cleaning up file ${path.basename(filePath)}:`, err);
  }
};

/**
 * Clean up uploaded files (async version)
 * @param {string} filePath - Path to the file to be deleted
 */
const cleanupFileAsync = async (filePath) => {
  if (!filePath) return;

  try {
    if (fs.existsSync(filePath)) {
      await unlinkFile(filePath);
    }
  } catch (err) {
    console.error(`Error cleaning up file ${path.basename(filePath)}:`, err);
  }
};

module.exports = {
  upload,
  cleanupFile,
  cleanupFileAsync,
  fileFilterConfig: {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024
  }
};