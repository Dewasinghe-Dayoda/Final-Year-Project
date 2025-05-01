const Clinic = require('../models/Clinic');
const mongoose = require('mongoose');

// Enhanced Colombo clinics data
const seedClinics = async () => {
  const count = await Clinic.countDocuments();
  if (count === 0) {
    await Clinic.insertMany([
      // ... (keep all your clinic data exactly as is) ...
    ]);
    console.log("Clinic database seeded with 10 Colombo dermatology centers");
  }
};

// Get clinics by location
const getClinics = async (req, res) => {
  try {
    const { location, radius } = req.query;

    if (!location || typeof location !== 'string' || location.trim() === '') {
      return res.status(400).json({ 
        error: "Location is required and must be a non-empty string." 
      });
    }

    const clinics = await Clinic.find({
      $or: [
        { location: new RegExp(location.trim(), 'i') },
        { name: new RegExp(location.trim(), 'i') }
      ]
    }).sort({ name: 1 });

    if (clinics.length === 0) {
      return res.status(404).json({ 
        error: "No clinics found for the specified location." 
      });
    }

    res.json(clinics);
  } catch (error) {
    console.error("Error fetching clinics:", error);
    res.status(500).json({ 
      error: "Server error while fetching clinics." 
    });
  }
};

// Get single clinic details
const getClinicDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid clinic ID format" 
      });
    }

    const clinic = await Clinic.findById(id).lean();
    
    if (!clinic) {
      return res.status(404).json({ 
        success: false,
        error: "Clinic not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: clinic
    });
  } catch (error) {
    console.error("Error fetching clinic details:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error while fetching clinic details",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Book appointment
const bookAppointment = async (req, res) => {
  try {
    const { clinicId, doctorName, date, time, patientId } = req.body;

    if (!clinicId || !doctorName || !date || !time || !patientId) {
      return res.status(400).json({ 
        error: "All booking fields are required." 
      });
    }

    res.json({
      success: true,
      booking: {
        reference: `BOOK-${Date.now()}`,
        clinicId,
        doctorName,
        date,
        time,
        status: "confirmed"
      }
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ 
      error: "Server error during booking." 
    });
  }
};

// Seed database on startup
seedClinics();

// Export all controller functions
module.exports = {
  getClinics,
  bookAppointment,
  getClinicDetails
};