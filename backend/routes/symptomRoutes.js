const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Sample symptom questions (replace with your actual questions)
const DISEASE_QUESTIONS = {
  'Cellulitis': [
    "Does the affected area feel warm to touch?",
    "Do you have fever or chills?",
    "Is the redness spreading rapidly?"
  ],
  'Impetigo': [
    "Do you have honey-colored crusts on the skin?",
    "Is the rash itchy?",
    "Are there fluid-filled blisters?"
  ],
  // Add questions for other diseases
};

router.get('/questions', authMiddleware, (req, res) => {
  try {
    const { disease } = req.query;
    if (!disease || !DISEASE_QUESTIONS[disease]) {
      return res.status(400).json({ error: 'Invalid disease specified' });
    }
    
    res.json({
      disease,
      questions: DISEASE_QUESTIONS[disease]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { answers, predictionId } = req.body;
    
    if (!answers || !predictionId) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // In a real app, you might process these answers further
    res.json({ 
      success: true,
      message: 'Symptoms recorded'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;