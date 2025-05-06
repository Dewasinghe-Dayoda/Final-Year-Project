const { expect } = require('chai'); // Add this import
const request = require('supertest');
const app = require('../../server');
const Clinic = require('../../models/Clinic');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('Appointment Controller', function() {
  this.timeout(5000); // Increase timeout

  let clinicId, token;

  before(async () => {
    // Clean up existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Connect to test DB
    await mongoose.connect('mongodb://localhost:27017/skinproscan_test');

    // Create test clinic
    const clinic = await Clinic.create({
      name: "Test Clinic",
      address: "123 Main St",
      phone: "0112345678",
      location: "Colombo",
      doctors: [{ name: "Dr. Test" }]
    });
    clinicId = clinic._id;

    // Create test user
    const user = await User.create({
      name: "Test User",
      email: "test@skinproscan.com",
      password: "hashedpassword"
    });

    // Generate valid JWT token
    token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should book appointment', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clinicId,
        doctorName: "Dr. Test",
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        time: "10:00"
      });
    
    expect(res.statusCode).to.equal(201);
    expect(res.body.booking).to.have.property('reference');
    expect(res.body.booking.reference).to.match(/APP-/);
  });
});