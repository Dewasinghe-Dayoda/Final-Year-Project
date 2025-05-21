const Appointment = require('../models/Appointment');
const Clinic = require('../models/Clinic');
const mongoose = require('mongoose');
const { createNotification } = require('../services/notificationService');

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('clinicId', 'name address')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error while fetching appointments" 
    });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid appointment ID" 
      });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, patientId: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        error: "Appointment not found" 
      });
    }

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error during cancellation" 
    });
  }
};

// Book appointment with enhanced conflict handling
const bookAppointment = async (req, res) => {
  try {
    const { clinicId, doctorName, date, time, notes } = req.body;
    const patientId = req.user.id;

    // Validate all required fields
    if (!clinicId || !doctorName || !date || !time) {
      return res.status(400).json({ 
        success: false,
        error: "All booking fields are required"
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

    // Check if time slot is already booked by this user
    const existingUserAppointment = await Appointment.findOne({
      clinicId,
      doctorName,
      date: new Date(date),
      time,
      patientId,
      status: { $ne: 'cancelled' }
    });

    if (existingUserAppointment) {
      return res.status(409).json({
        success: false,
        error: "You already have an appointment for this time slot",
        existingAppointment: existingUserAppointment,
        conflictType: 'user'
      });
    }

    // Check if time slot is booked by any user
    const existingAppointment = await Appointment.findOne({
      clinicId,
      doctorName,
      date: new Date(date),
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        error: "Time slot already booked by another user",
        existingAppointment,
        conflictType: 'general'
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
      appointment
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Internal server error during booking"
    });
  }
};

module.exports = {
  getUserAppointments,
  cancelAppointment,
  bookAppointment
};