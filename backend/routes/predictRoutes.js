const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { upload, cleanupFile } = require('../controllers/predictionController');
const authMiddleware = require('../middleware/authMiddleware');
const History = require('../models/History');

/**
 * @route POST /api/predict/save-result
 * @desc Save prediction results from frontend analysis
 * @access Private
 */
router.post('/save-result', authMiddleware, async (req, res) => {
  try {
    const { results, imageInfo, symptoms } = req.body;
    
    // Validate request data
    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ error: 'Invalid prediction data format' });
    }
    if (!imageInfo?.name || !imageInfo?.size) {
      return res.status(400).json({ error: 'Missing image information' });
    }

    // Calculate recommendation metrics
    const primaryResult = results[0]; // Results should be pre-sorted by confidence
    const needsConsultation = primaryResult.rawConfidence > 0.5;
    const urgency = primaryResult.rawConfidence > 0.7 ? 'high' : 
                   primaryResult.rawConfidence > 0.5 ? 'medium' : 'low';

    const historyEntry = await History.create({
      userId: req.user.id,
      imageName: imageInfo.name,
      imageSize: imageInfo.size,
      predictionResults: results,
      symptoms: symptoms || {},
      diagnosis: {
        condition: primaryResult.disease,
        confidence: primaryResult.confidence
      },
      recommendation: {
        needsConsultation,
        urgency,
        timestamp: new Date()
      }
    });

    res.json({ 
      success: true, 
      historyEntry,
      recommendation: historyEntry.recommendation
    });
  } catch (error) {
    console.error('Error saving prediction:', error);
    res.status(500).json({ 
      error: 'Failed to save prediction results',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/predict/upload-image
 * @desc Upload image for optional server-side processing
 * @access Private
 */
router.post('/upload-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file received' });
    }

    res.json({ 
      success: true,
      imageInfo: {
        name: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    
    // Clean up uploaded file if error occurred
    if (req.file?.path) {
      await cleanupFile(req.file.path).catch(cleanupError => {
        console.error('Failed to cleanup file:', cleanupError);
      });
    }

    res.status(500).json({ 
      error: 'Image upload failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;