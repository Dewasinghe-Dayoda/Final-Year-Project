const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    index: true // For faster queries
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  services: [String],
  doctors: [{
    name: String,
    specialization: String,
    availability: [{
      day: String,
      slots: [String] // e.g. ["09:00-10:00", "14:00-15:00"]
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2Dsphere index for geospatial queries
clinicSchema.index({ location: 'text' });

module.exports = mongoose.model('Clinic', clinicSchema);