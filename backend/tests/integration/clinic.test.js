const request = require('supertest');
const { Clinic, Appointment } = require('../../models');
const app = require('../../server');

describe('Clinic Booking System', () => {
  let clinicId;
  let authToken;

  beforeAll(async () => {
    // Setup test clinic
    const clinic = await Clinic.create({
      name: "Test Clinic",
      doctors: [{ name: "Dr. Smith" }]
    });
    clinicId = clinic._id;

    // Get auth token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@skinproscan.com', password: 'Test123!' });
    authToken = loginRes.body.token;
  });

  it('should book an appointment', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        clinicId,
        doctorName: "Dr. Smith",
        date: "2024-06-01",
        time: "10:00"
      });

    expect(res.status).toBe(201);
    expect(res.body.booking.status).toBe('confirmed');
  });
});