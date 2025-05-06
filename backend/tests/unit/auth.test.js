const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');

describe('Auth Controller', () => {
  before(async function() {
    this.timeout(5000); // Increase timeout
    
    // Close existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/skinproscan_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@skinproscan.com',
        password: 'Test123!'
      });
    
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('token');
  });
});