const multer = require('multer');
const path = require('path');
const fs = require('fs');
const util = require('util');
const Prediction = require('../models/Predictions');
const History = require('../models/History');

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

// Symptom patterns for each disease (1 = yes, 0 = no, -1 = doesn't matter)
const DISEASE_SYMPTOMS = {
  'Cellulitis': {
    itching: 1,
    redness: 1,
    swelling: 1,
    pain: 1,
    scaling: 0,
    pus: 0
  },
  'Impetigo': {
    itching: 1,
    redness: 1,
    swelling: 0,
    pain: 0,
    scaling: 1,
    pus: 1
  },
  'Ringworm': {
    itching: 1,
    redness: 1,
    swelling: 0,
    pain: 0,
    scaling: 1,
    pus: 0
  },
  'Athlete Foot': {
    itching: 1,
    redness: 1,
    swelling: 0,
    pain: 0,
    scaling: 1,
    pus: 0
  }
};

const calculateSymptomMatch = (symptoms) => {
  const userAnswers = {
    itching: symptoms.itching === 'yes' ? 1 : 0,
    redness: symptoms.redness === 'yes' ? 1 : 0,
    swelling: symptoms.swelling === 'yes' ? 1 : 0,
    pain: symptoms.pain === 'yes' ? 1 : 0,
    scaling: symptoms.scaling === 'yes' ? 1 : 0,
    pus: symptoms.pus === 'yes' ? 1 : 0
  };

  const matches = {};
  let totalPossible = 0;

  Object.keys(DISEASE_SYMPTOMS).forEach(disease => {
    const pattern = DISEASE_SYMPTOMS[disease];
    let matchCount = 0;
    let totalRelevant = 0;

    Object.keys(pattern).forEach(symptom => {
      if (pattern[symptom] !== -1) {
        totalRelevant++;
        if (userAnswers[symptom] === pattern[symptom]) {
          matchCount++;
        }
      }
    });

    const percentage = totalRelevant > 0 ? Math.round((matchCount / totalRelevant) * 100) : 0;
    matches[disease] = percentage;
    totalPossible += percentage;
  });

  const normalizedMatches = {};
  Object.keys(matches).forEach(disease => {
    normalizedMatches[disease] = totalPossible > 0 
      ? Math.round((matches[disease] / totalPossible) * 100) 
      : 0;
  });

  return Object.entries(normalizedMatches)
    .sort((a, b) => b[1] - a[1])
    .map(([disease, percentage]) => ({ disease, percentage }));
};

const combineResults = (imageResults, symptomResults) => {
  const imageConfidence = {};
  imageResults.forEach(result => {
    imageConfidence[result.disease] = parseFloat(result.confidence);
  });

  return symptomResults.map(symptomResult => {
    const imageConf = imageConfidence[symptomResult.disease] || 0;
    const combinedConf = (imageConf * 0.6) + (symptomResult.percentage * 0.4);
    return {
      disease: symptomResult.disease,
      imageConfidence: imageConf,
      symptomConfidence: symptomResult.percentage,
      combinedConfidence: combinedConf
    };
  }).sort((a, b) => b.combinedConfidence - a.combinedConfidence);
};

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
  calculateSymptomMatch,
  combineResults,
  fileFilterConfig: {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024
  }
};