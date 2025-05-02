const Clinic = require('../models/Clinic');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

// Colombo clinics data
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
        success: false,
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
        success: false,
        error: "No clinics found for the specified location." 
      });
    }

    res.status(200).json({
      success: true,
      data: clinics
    });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error while fetching clinics.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
    const { clinicId, doctorName, date, time, notes } = req.body;
    const patientId = req.user.id; // Get from authenticated user

    // Validate all required fields
    if (!clinicId || !doctorName || !date || !time) {
      return res.status(400).json({ 
        success: false,
        error: "All booking fields are required",
        missingFields: {
          clinicId: !clinicId,
          doctorName: !doctorName,
          date: !date,
          time: !time
        }
      });
    }

    // Validate clinic exists
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ 
        success: false,
        error: "Clinic not found"
      });
    }

    // Validate doctor exists in clinic
    if (!clinic.doctors.some(doc => doc.name === doctorName)) {
      return res.status(400).json({ 
        success: false,
        error: "Doctor not found at this clinic"
      });
    }

    // Check for existing appointment
    const existingAppointment = await Appointment.findOne({
      clinicId,
      doctorName,
      date: new Date(date),
      time,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        error: "Time slot already booked"
      });
    }

    // Create appointment
    const appointment = new Appointment({
      clinicId,
      doctorName,
      date: new Date(date),
      time,
      patientId,
      notes: notes || "Skin condition consultation",
      status: "confirmed",
      reference: `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      booking: {
        ...appointment.toObject(),
        clinicName: clinic.name
      }
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error during booking",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Seed database on startup
seedClinics();

module.exports = {
  getClinics,
  getClinicDetails,
  bookAppointment
};