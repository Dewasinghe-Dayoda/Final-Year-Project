const Clinic = require('../models/Clinic');
const mongoose = require('mongoose');

// Enhanced Colombo clinics data
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
        website: "www.colomboskin.com",
        services: ["General Dermatology", "Skin Cancer Screening", "Cosmetic Procedures"],
        openingHours: "Weekdays: 8:00 AM - 6:00 PM, Saturday: 8:00 AM - 1:00 PM",
        description: "Premier dermatology center with state-of-the-art facilities",
        images: ["clinic1.jpg", "clinic1-2.jpg"],
        doctors: [
          {
            name: "Dr. Saman Perera",
            specialization: "Cosmetic Dermatology",
            qualifications: "MBBS, MD (Dermatology)",
            experience: "15 years",
            availability: [
              { day: "Monday", slots: ["09:00-11:00", "14:00-16:00"] },
              { day: "Wednesday", slots: ["10:00-12:00"] }
            ]
          },
          {
            name: "Dr. Priyanka Silva",
            specialization: "Pediatric Dermatology",
            qualifications: "MBBS, MD (Pediatrics), Diploma in Dermatology",
            experience: "10 years",
            availability: [
              { day: "Tuesday", slots: ["08:00-12:00"] },
              { day: "Friday", slots: ["13:00-17:00"] }
            ]
          }
        ]
      },
      {
        name: "Dermatology Specialists Center",
        address: "45 Union Place, Colombo 02",
        location: "Colombo",
        phone: "+94 11 3456789",
        email: "contact@dermspecialists.lk",
        website: "www.dermspecialists.lk",
        services: ["Pediatric Dermatology", "Laser Therapy", "Skin Allergy Treatment"],
        openingHours: "Weekdays: 7:30 AM - 7:30 PM, Sunday: 9:00 AM - 1:00 PM",
        description: "Specialized dermatology care with advanced laser treatments",
        images: ["clinic2.jpg", "clinic2-2.jpg"],
        doctors: [
          {
            name: "Dr. Nimali Fernando",
            specialization: "Pediatric Dermatology",
            qualifications: "MBBS, MD (Dermatology)",
            experience: "12 years",
            availability: [
              { day: "Tuesday", slots: ["08:00-12:00"] },
              { day: "Thursday", slots: ["13:00-17:00"] }
            ]
          },
          {
            name: "Dr. Rajiv Sharma",
            specialization: "Laser Dermatology",
            qualifications: "MBBS, MD (Dermatology), Fellowship in Laser Surgery",
            experience: "8 years",
            availability: [
              { day: "Monday", slots: ["10:00-13:00"] },
              { day: "Wednesday", slots: ["14:00-18:00"] }
            ]
          }
        ]
      },
      {
        name: "Skin Health Colombo",
        address: "78 Horton Place, Colombo 07",
        location: "Colombo",
        phone: "+94 11 4567890",
        email: "info@skinhealth.lk",
        website: "www.skinhealth.lk",
        services: ["Acne Treatment", "Psoriasis Care", "Hair Disorders"],
        openingHours: "Daily: 8:00 AM - 8:00 PM",
        description: "Comprehensive skin care with a focus on chronic conditions",
        images: ["clinic3.jpg", "clinic3-2.jpg"],
        doctors: [
          {
            name: "Dr. Anjali Ratnayake",
            specialization: "Acne Specialist",
            qualifications: "MBBS, MD (Dermatology)",
            experience: "9 years",
            availability: [
              { day: "Monday", slots: ["09:00-12:00"] },
              { day: "Thursday", slots: ["14:00-17:00"] }
            ]
          }
        ]
      },
      {
        name: "The Skin Clinic",
        address: "32 Ward Place, Colombo 07",
        location: "Colombo",
        phone: "+94 11 5678901",
        email: "appointments@theskinclinic.lk",
        website: "www.theskinclinic.lk",
        services: ["Skin Cancer Screening", "Mohs Surgery", "Dermatopathology"],
        openingHours: "Weekdays: 8:30 AM - 5:30 PM",
        description: "Specialized in skin cancer diagnosis and treatment",
        images: ["clinic4.jpg", "clinic4-2.jpg"],
        doctors: [
          {
            name: "Dr. Sunil De Silva",
            specialization: "Dermatologic Surgery",
            qualifications: "MBBS, MD (Dermatology), Fellowship in Mohs Surgery",
            experience: "18 years",
            availability: [
              { day: "Tuesday", slots: ["08:30-12:30"] },
              { day: "Friday", slots: ["13:30-17:30"] }
            ]
          }
        ]
      },
      {
        name: "Colombo Dermatology Center",
        address: "120 Havelock Road, Colombo 05",
        location: "Colombo",
        phone: "+94 11 6789012",
        email: "cdc@colomboderm.com",
        website: "www.colomboderm.com",
        services: ["Cosmetic Dermatology", "Anti-Aging Treatments", "Botox"],
        openingHours: "Weekdays: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM",
        description: "Advanced cosmetic dermatology and aesthetic treatments",
        images: ["clinic5.jpg", "clinic5-2.jpg"],
        doctors: [
          {
            name: "Dr. Maya Perera",
            specialization: "Aesthetic Dermatology",
            qualifications: "MBBS, MD (Dermatology), Diploma in Aesthetic Medicine",
            experience: "11 years",
            availability: [
              { day: "Wednesday", slots: ["09:00-13:00"] },
              { day: "Saturday", slots: ["09:00-14:00"] }
            ]
          }
        ]
      },
      {
        name: "National Skin Hospital",
        address: "234 Baseline Road, Colombo 09",
        location: "Colombo",
        phone: "+94 11 7890123",
        email: "info@nationalskinhospital.lk",
        website: "www.nationalskinhospital.lk",
        services: ["General Dermatology", "Skin Surgery", "Phototherapy"],
        openingHours: "24/7 Emergency Services",
        description: "Largest dermatology hospital in Sri Lanka with full facilities",
        images: ["clinic6.jpg", "clinic6-2.jpg"],
        doctors: [
          {
            name: "Dr. Asanka Bandara",
            specialization: "Dermatologic Surgery",
            qualifications: "MBBS, MS (Dermatology)",
            experience: "14 years",
            availability: [
              { day: "Monday", slots: ["08:00-16:00"] },
              { day: "Thursday", slots: ["08:00-16:00"] }
            ]
          }
        ]
      },
      {
        name: "Skin & Laser Center",
        address: "56 Duplication Road, Colombo 04",
        location: "Colombo",
        phone: "+94 11 8901234",
        email: "laser@skinlaser.lk",
        website: "www.skinlaser.lk",
        services: ["Laser Hair Removal", "Tattoo Removal", "Skin Resurfacing"],
        openingHours: "Weekdays: 10:00 AM - 7:00 PM",
        description: "Specialized laser treatments with the latest technology",
        images: ["clinic7.jpg", "clinic7-2.jpg"],
        doctors: [
          {
            name: "Dr. Dilani Jayasuriya",
            specialization: "Laser Dermatology",
            qualifications: "MBBS, MD (Dermatology), Laser Certification",
            experience: "7 years",
            availability: [
              { day: "Tuesday", slots: ["10:00-13:00"] },
              { day: "Friday", slots: ["14:00-19:00"] }
            ]
          }
        ]
      },
      {
        name: "Children's Skin Care",
        address: "89 Gregory's Road, Colombo 07",
        location: "Colombo",
        phone: "+94 11 9012345",
        email: "children@childskin.lk",
        website: "www.childskin.lk",
        services: ["Pediatric Dermatology", "Birthmark Treatment", "Eczema Care"],
        openingHours: "Weekdays: 8:00 AM - 4:00 PM",
        description: "Specialized dermatology care for children and infants",
        images: ["clinic8.jpg", "clinic8-2.jpg"],
        doctors: [
          {
            name: "Dr. Shyama Fernando",
            specialization: "Pediatric Dermatology",
            qualifications: "MBBS, MD (Pediatrics), Diploma in Dermatology",
            experience: "13 years",
            availability: [
              { day: "Monday", slots: ["08:00-12:00"] },
              { day: "Wednesday", slots: ["08:00-12:00"] }
            ]
          }
        ]
      },
      {
        name: "Ayurvedic Skin Solutions",
        address: "102 Ayurveda Road, Colombo 10",
        location: "Colombo",
        phone: "+94 11 0123456",
        email: "ayurveda@skinsolutions.lk",
        website: "www.ayurvedicskinsolutions.lk",
        services: ["Ayurvedic Treatments", "Herbal Therapies", "Psoriasis Care"],
        openingHours: "Daily: 7:00 AM - 7:00 PM",
        description: "Traditional Ayurvedic treatments for skin conditions",
        images: ["clinic9.jpg", "clinic9-2.jpg"],
        doctors: [
          {
            name: "Dr. Sanjeewa Weerasinghe",
            specialization: "Ayurvedic Dermatology",
            qualifications: "BAMS, MD (Ayurveda)",
            experience: "20 years",
            availability: [
              { day: "Tuesday", slots: ["07:00-12:00"] },
              { day: "Thursday", slots: ["07:00-12:00"] }
            ]
          }
        ]
      },
      {
        name: "Modern Dermatology",
        address: "11 Independence Avenue, Colombo 07",
        location: "Colombo",
        phone: "+94 11 1234567",
        email: "modern@modernderm.lk",
        website: "www.modernderm.lk",
        services: ["General Dermatology", "Skin Cancer", "Hair Loss"],
        openingHours: "Weekdays: 8:00 AM - 5:00 PM",
        description: "Comprehensive dermatological services with modern techniques",
        images: ["clinic10.jpg", "clinic10-2.jpg"],
        doctors: [
          {
            name: "Dr. Ranil Premaratne",
            specialization: "Hair Disorders",
            qualifications: "MBBS, MD (Dermatology), Trichology Certification",
            experience: "16 years",
            availability: [
              { day: "Wednesday", slots: ["08:00-12:00"] },
              { day: "Friday", slots: ["13:00-17:00"] }
            ]
          }
        ]
      }
    ]);
    console.log("Clinic database seeded with 10 Colombo dermatology centers");
  }
};

// Get clinics by location
exports.getClinics = async (req, res) => {
  try {
    const { location } = req.query;

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

// Get single clinic details-updated
exports.getClinicDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // More robust ID validation
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
exports.bookAppointment = async (req, res) => {
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