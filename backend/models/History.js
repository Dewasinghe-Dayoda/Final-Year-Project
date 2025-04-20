const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  imageInfo: {
    name: String,
    size: Number,
    path: String // Optional if storing files
  },
  predictionResults: [{
    disease: String,
    confidence: String,
    rawConfidence: Number
  }],
  symptoms: [{
    question: String,
    answer: String
  }],
  date: { 
    type: Date, 
    default: Date.now 
  },
  recommendation: {
    needsConsultation: Boolean,
    urgency: String // 'low', 'medium', 'high'
  }
}, { timestamps: true });

// Add index for faster queries
HistorySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('History', HistorySchema);