const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  predictionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prediction',
    required: true
  },
  imageInfo: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    path: String // Optional if storing files
  },
  diagnosis: {
    condition: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      required: true
    },
    imageConfidence: Number,
    symptomConfidence: Number
  },
  symptoms: {
    itching: String,
    redness: String,
    swelling: String,
    pain: String,
    scaling: String,
    pus: String
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  recommendation: {
    needsConsultation: {
      type: Boolean,
      required: true
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    details: [String] // Specific recommendations
  },
  
  legacyResults: {
    predictionResults: [{
      disease: String,
      confidence: String,
      rawConfidence: Number
    }],
    symptomQuestions: [{
      question: String,
      answer: String
    }]
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for faster queries
HistorySchema.index({ userId: 1, date: -1 });
HistorySchema.index({ predictionId: 1 });

// Virtual for formatted date
HistorySchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for quick access to top result
HistorySchema.virtual('topResult').get(function() {
  if (this.diagnosis) {
    return {
      disease: this.diagnosis.condition,
      confidence: this.diagnosis.confidence
    };
  }
  return this.legacyResults?.predictionResults?.[0] || null;
});

module.exports = mongoose.model('History', HistorySchema);