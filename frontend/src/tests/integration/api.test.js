const request = require('supertest');
const app = require('../../server');

describe('QuickCheck API', () => {
  let token;

  before(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@skinproscan.com', password: 'Test123!' });
    token = res.body.token;
  });

  it('should predict disease from image', async () => {
    const res = await request(app)
      .post('/api/quickcheck/predict')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', 'tests/test_images/cellulitis.jpg');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('disease');
  });
});