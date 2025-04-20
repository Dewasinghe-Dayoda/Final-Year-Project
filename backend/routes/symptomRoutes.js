const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const History = require('../models/History');

// Enhanced question bank with IDs and more detailed questions
const DISEASE_QUESTIONS = {
  'Cellulitis': [
    { id: 'cel1', text: "Does the affected area feel warm to touch?" },
    { id: 'cel2', text: "Do you have fever above 38°C (100.4°F)?" },
    { id: 'cel3', text: "Is the redness expanding rapidly (more than 1cm/hour)?" }
  ],
  'Impetigo': [
    { id: 'imp1', text: "Do you see honey-colored crusts on the lesions?" },
    { id: 'imp2', text: "Are there small blisters that burst easily?" },
    { id: 'imp3', text: "Has it spread after scratching?" }
  ],
  'Ringworm': [
    { id: 'ring1', text: "Is the rash circular with raised edges?" },
    { id: 'ring2', text: "Is the center of the lesion clearing up?" },
    { id: 'ring3', text: "Does it itch intensely?" }
  ],
  'Athlete Foot': [
    { id: 'ath1', text: "Do you have scaling between toes?" },
    { id: 'ath2', text: "Is there a burning or stinging sensation?" },
    { id: 'ath3', text: "Does it worsen with tight shoes?" }
  ]
};

router.get('/questions', authMiddleware, (req, res) => {
  try {
    const { disease } = req.query;
    
    if (!disease || !DISEASE_QUESTIONS[disease]) {
      return res.status(400).json({ 
        error: 'Invalid disease specified',
        availableDiseases: Object.keys(DISEASE_QUESTIONS)
      });
    }
    
    res.json({
      disease,
      questions: DISEASE_QUESTIONS[disease]
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch symptom questions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const { answers, predictionId } = req.body;
    
    if (!answers || !predictionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update history record
    const updated = await History.findOneAndUpdate(
      { _id: predictionId, userId },
      { $set: { symptoms: answers } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Prediction record not found' });
    }

    res.json({ 
      success: true,
      updatedRecord: updated
    });
  } catch (error) {
    console.error('Error saving symptoms:', error);
    res.status(500).json({ 
      error: 'Failed to save symptoms',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;