const request = require('supertest');
const app = require('../../server');
const History = require('../../models/History');

describe('History Controller', () => {
  it('should fetch user prediction history', async () => {
    // Seed test data
    await History.create({
        userId: "507f1f77bcf86cd799439011",
        predictionId: new mongoose.Types.ObjectId(),
        imageInfo: {
          name: "test.jpg",
          size: 1024
        },
        diagnosis: {
          condition: "Cellulitis",
          confidence: 85
        },
        recommendation: {
          needsConsultation: true,
          urgency: "medium"
        }
    });

    const res = await request(app)
      .get('/api/history')
      .set('Authorization', 'Bearer valid-test-token');

    expect(res.statusCode).toEqual(200);
    expect(res.body[0]).toHaveProperty('prediction');
  });
});