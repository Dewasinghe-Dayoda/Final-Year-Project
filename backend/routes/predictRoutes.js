const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios'); // For forwarding requests to Python backend
const path = require('path');
const fs = require('fs');
const util = require('util');

const unlinkFile = util.promisify(fs.unlink);

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Forward prediction request to Python backend
router.post('/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image file uploaded' 
      });
    }

    // Forward the image to Python backend
    const pythonApiResponse = await axios.post(
      'http://localhost:8000/predict', // Your Python API endpoint
      { image: req.file.path }, // Or send as FormData
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // Clean up the uploaded file
    await unlinkFile(req.file.path);

    // Return the Python API's response
    res.json(pythonApiResponse.data);

  } catch (err) {
    console.error('Prediction error:', err);
    
    // Clean up on error
    if (req.file?.path) {
      await unlinkFile(req.file.path).catch(cleanupErr => {
        console.error('File cleanup error:', cleanupErr);
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Prediction failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;