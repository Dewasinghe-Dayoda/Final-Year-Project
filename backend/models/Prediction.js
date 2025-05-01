const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageName: {
    type: String,
    required: true
  },
  imageSize: {
    type: Number,
    required: true
  },
  predictionResults: {
    type: Array,
    required: true
  },
  symptomResults: {
    type: Array,
    required: true
  },
  combinedResults: {
    type: Array,
    required: true
  },
  symptoms: {
    type: Object,
    required: true
  },
  diagnosis: {
    condition: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      required: true
    }
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
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for better query performance
predictionSchema.index({ userId: 1, createdAt: -1 });

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;