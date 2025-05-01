const express = require('express');
const router = express.Router();
const { 
  upload, 
  cleanupFile,
  cleanupFileAsync,
  calculateSymptomMatch,
  combineResults
} = require('../controllers/predictionController');
const authMiddleware = require('../middleware/authMiddleware');
const Prediction = require('../models/Predictions');
const History = require('../models/History');

router.post('/save-result', authMiddleware, async (req, res) => {
  try {
    const { results, imageInfo, symptoms } = req.body;
    
    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ error: 'Invalid prediction data format' });
    }
    if (!imageInfo?.name || !imageInfo?.size) {
      return res.status(400).json({ error: 'Missing image information' });
    }

    // Calculate symptom matches
    const symptomResults = calculateSymptomMatch(symptoms);
    const combinedResults = combineResults(results, symptomResults);
    
    const primaryResult = combinedResults[0];
    const needsConsultation = primaryResult.combinedConfidence > 50;
    const urgency = primaryResult.combinedConfidence > 70 ? 'high' : 
                   primaryResult.combinedConfidence > 50 ? 'medium' : 'low';

    // Save to Prediction collection
    const prediction = await Prediction.create({
      userId: req.user.id,
      imageName: imageInfo.name,
      imageSize: imageInfo.size,
      predictionResults: results,
      symptomResults,
      combinedResults,
      symptoms,
      diagnosis: {
        condition: primaryResult.disease,
        confidence: primaryResult.combinedConfidence
      },
      recommendation: {
        needsConsultation,
        urgency,
        timestamp: new Date()
      }
    });

    // Also save to History collection
    const historyEntry = await History.create({
      userId: req.user.id,
      predictionId: prediction._id,
      imageName: imageInfo.name,
      imageSize: imageInfo.size,
      diagnosis: prediction.diagnosis,
      recommendation: prediction.recommendation,
      timestamp: new Date()
    });

    res.json({ 
      success: true, 
      prediction,
      historyEntry,
      recommendation: prediction.recommendation
    });
  } catch (error) {
    console.error('Error saving prediction:', error);
    res.status(500).json({ 
      error: 'Failed to save prediction results',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

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
    
    if (req.file?.path) {
      await cleanupFileAsync(req.file.path).catch(cleanupError => {
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