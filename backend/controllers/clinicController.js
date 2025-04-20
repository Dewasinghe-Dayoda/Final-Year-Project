const Clinic = require('../models/Clinic');

// Sample Colombo clinics data
const seedClinics = async () => {
  const count = await Clinic.countDocuments();
  if (count === 0) {
    await Clinic.insertMany([
      {
        name: "Colombo Skin Clinic",
        address: "123 Galle Road, Colombo 03",
        location: "Colombo",
        phone: "+94 11 2345678",
        email: "info@colomboskin.com",
        services: ["General Dermatology", "Skin Cancer Screening"],
        doctors: [
          {
            name: "Dr. Saman Perera",
            specialization: "Cosmetic Dermatology",
            availability: [
              { day: "Monday", slots: ["09:00-11:00", "14:00-16:00"] },
              { day: "Wednesday", slots: ["10:00-12:00"] }
            ]
          }
        ]
      },
      {
        name: "Dermatology Specialists",
        address: "45 Union Place, Colombo 02",
        location: "Colombo",
        phone: "+94 11 3456789",
        services: ["Pediatric Dermatology", "Laser Therapy"],
        doctors: [
          {
            name: "Dr. Nimali Fernando",
            specialization: "Pediatric Dermatology",
            availability: [
              { day: "Tuesday", slots: ["08:00-12:00"] },
              { day: "Thursday", slots: ["13:00-17:00"] }
            ]
          }
        ]
      }
    ]);
    console.log("Clinic database seeded");
  }
};

// Get clinics by location
exports.getClinics = async (req, res) => {
  try {
    const { location } = req.query;
    
    const clinics = await Clinic.find({
      $or: [
        { location: new RegExp(location, 'i') },
        { name: new RegExp(location, 'i') }
      ]
    }).sort({ name: 1 });

    res.json(clinics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { clinicId, doctorName, date, time, patientId } = req.body;
    
    // In a real app, you would:
    // 1. Validate slot availability
    // 2. Create appointment record
    // 3. Send confirmation
    
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
    res.status(500).json({ error: error.message });
  }
};

// Seed database on startup
seedClinics();