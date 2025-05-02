// const Appointment = require('./Appointment');
// const Clinic = require('./Clinic');
// const Notification = require('./Notification');
// const mongoose = require('mongoose');

// // Book appointment
// const bookAppointment = async (req, res) => {
//   try {
//     const { clinicId, doctorName, date, time, notes } = req.body;
//     const patientId = req.user.id;

//     if (!mongoose.Types.ObjectId.isValid(clinicId)) {
//       return res.status(400).json({ error: "Invalid clinic ID" });
//     }

//     // Validate clinic exists
//     const clinic = await Clinic.findById(clinicId);
//     if (!clinic) {
//       return res.status(404).json({ error: "Clinic not found" });
//     }

//     // Validate doctor exists in clinic
//     if (!clinic.doctors.some(doc => doc.name === doctorName)) {
//       return res.status(400).json({ error: "Doctor not found at this clinic" });
//     }

//     // Check for existing appointment at same time
//     const existingAppointment = await Appointment.findOne({
//       clinicId,
//       doctorName,
//       date,
//       time,
//       status: { $in: ['pending', 'confirmed'] }
//     });

//     if (existingAppointment) {
//       return res.status(409).json({ error: "Time slot already booked" });
//     }

//     const appointment = new Appointment({
//       patientId,
//       clinicId,
//       doctorName,
//       date: new Date(date),
//       time,
//       notes,
//       status: 'confirmed'
//     });

//     await appointment.save();

//     // Create notification
//     const notification = new Notification({
//       userId: patientId,
//       type: 'appointment',
//       title: 'Appointment Booked',
//       message: `Your appointment with Dr. ${doctorName} on ${date} at ${time} has been confirmed.`,
//       relatedId: appointment._id,
//       read: false
//     });
//     await notification.save();

//     res.status(201).json({
//       success: true,
//       appointment,
//       notification
//     });

//   } catch (error) {
//     console.error("Booking error:", error);
//     res.status(500).json({ 
//       error: "Server error during booking",
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Get user appointments
// const getUserAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ patientId: req.user.id })
//       .populate('clinicId', 'name address')
//       .sort({ date: -1 });

//     res.json({
//       success: true,
//       appointments
//     });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ 
//       error: "Server error while fetching appointments" 
//     });
//   }
// };

// // Cancel appointment
// const cancelAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid appointment ID" });
//     }

//     const appointment = await Appointment.findOneAndUpdate(
//       { _id: id, patientId: req.user.id },
//       { status: 'cancelled' },
//       { new: true }
//     );

//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found" });
//     }

//     // Create cancellation notification
//     const notification = new Notification({
//       userId: req.user.id,
//       type: 'appointment',
//       title: 'Appointment Cancelled',
//       message: `Your appointment with Dr. ${appointment.doctorName} has been cancelled.`,
//       relatedId: appointment._id,
//       read: false
//     });
//     await notification.save();

//     res.json({
//       success: true,
//       appointment,
//       notification
//     });

//   } catch (error) {
//     console.error("Cancellation error:", error);
//     res.status(500).json({ 
//       error: "Server error during cancellation" 
//     });
//   }
// };

// // Update appointment
// const updateAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { date, time, notes } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid appointment ID" });
//     }

//     const appointment = await Appointment.findOneAndUpdate(
//       { _id: id, patientId: req.user.id },
//       { date, time, notes },
//       { new: true }
//     );

//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found" });
//     }

//     // Create update notification
//     const notification = new Notification({
//       userId: req.user.id,
//       type: 'appointment',
//       title: 'Appointment Updated',
//       message: `Your appointment with Dr. ${appointment.doctorName} has been updated. New time: ${date} at ${time}.`,
//       relatedId: appointment._id,
//       read: false
//     });
//     await notification.save();

//     res.json({
//       success: true,
//       appointment,
//       notification
//     });

//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({ 
//       error: "Server error during update" 
//     });
//   }
// };

// module.exports = {
//   bookAppointment,
//   getUserAppointments,
//   cancelAppointment,
//   updateAppointment
// };
// backend/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  reference: {
    type: String,
    unique: true
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);