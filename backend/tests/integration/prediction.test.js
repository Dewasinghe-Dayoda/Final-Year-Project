const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const app = require('../../server');
const Prediction = require('../../models/Prediction');

// Mock Python server
const axios = require('axios');
jest.mock('axios');

let mongoServer;
let authToken;

beforeAll(async () => {
  // Start in-memory DB
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();

  // Mock user login to get token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@skinproscan.com', password: 'Test123!' });
  authToken = loginRes.body.token;
});

afterAll(async () => {
  await mongoServer.stop();
});

describe('POST /api/quickcheck/predict', () => {
  it('should process image and return prediction', async () => {
    // 1. Mock Python API response
    axios.post.mockResolvedValue({
      data: {
        disease: 'Cellulitis',
        confidence: 0.85,
        message: 'Success'
      }
    });

    // 2. Create test image file
    const testImagePath = path.join(__dirname, 'test_images', 'cellulitis.jpg');
    fs.writeFileSync(testImagePath, Buffer.from('fake-image-data'));

    // 3. Make request
    const res = await request(app)
      .post('/api/quickcheck/predict')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', testImagePath);

    // 4. Verify response
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      disease: 'Cellulitis',
      confidence: 85,
      message: 'Success'
    });

    // 5. Verify database record
    const prediction = await Prediction.findOne();
    expect(prediction.diagnosis.condition).toBe('Cellulitis');
  });

  it('should reject invalid file types', async () => {
    const res = await request(app)
      .post('/api/quickcheck/predict')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', Buffer.from('fake-data'), { filename: 'invalid.txt' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/image file/i);
  });
});