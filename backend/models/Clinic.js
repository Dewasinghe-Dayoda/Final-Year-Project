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
    index: true
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  website: String,
  services: [String],
  openingHours: String,
  description: String,
  images: [String],
  doctors: [{
    name: String,
    specialization: String,
    qualifications: String,
    experience: String,
    availability: [{
      day: String,
      slots: [String]
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

clinicSchema.index({ location: 'text' });

module.exports = mongoose.model('Clinic', clinicSchema);