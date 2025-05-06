const request = require('supertest');
const app = require('../../server');
const Clinic = require('../../models/Clinic');
require('./testSetup');

describe('Clinic Controller', () => {
  beforeEach(async () => await Clinic.deleteMany({}));

  it('should list clinics', async () => {
    await Clinic.create({
      name: "Test Clinic",
      address: "123 Main St",
      phone: "0112345678",
      location: "Colombo",
      doctors: [{ name: "Dr. Test" }]
    });

    const res = await request(app)
      .get('/api/clinics?location=Colombo');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data[0].name).toEqual("Test Clinic");
  });
});