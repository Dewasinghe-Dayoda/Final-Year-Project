const { expect } = require('chai');
const request = require('supertest');
const app = require('../../server');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const sinon = require('sinon');
const axios = require('axios');

describe('Prediction Controller', function() {
  this.timeout(10000);

  const testDir = path.join(__dirname, '../test_images');
  const testImage = path.join(testDir, 'skin_test.jpg');
  let axiosStub;

  before(async () => {
    // Setup MongoDB
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect('mongodb://localhost:27017/skinproscan_test');

    // Create test image
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    fs.writeFileSync(testImage, 'dummy-image-data');

    // Mock axios call to Python service
    axiosStub = sinon.stub(axios, 'post').resolves({
      data: {
        disease: 'Cellulitis',
        confidence: 0.85,
        message: 'Success'
      }
    });
  });

  after(async () => {
    // Cleanup
    if (fs.existsSync(testImage)) {
      fs.unlinkSync(testImage);
    }
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    axiosStub.restore();
  });

  it('should predict skin disease', async () => {
    const res = await request(app)
      .post('/api/quickcheck/predict')
      .attach('image', testImage);
    
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('disease');
  });
});