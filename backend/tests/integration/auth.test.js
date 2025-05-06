const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const assert = require('assert');

let app;
let User;

describe('Auth Controller', function () {
  let mongoServer;

  const testEmail = 'test-auth@skinproscan.com';
  const testPassword = 'Test123!';

  before(async function () {
    this.timeout(10000);

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Set test DB URI before requiring app
    process.env.MONGO_URI = uri;
    process.env.NODE_ENV = 'test';

    app = require('../../server');

    // Wait for mongoose to connect
    await mongoose.connect(uri);

    // Import model
    User = require('../../models/User');

    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await User.create({
      name: 'Test User',
      email: testEmail,
      password: hashedPassword,
    });
  });

  after(async function () {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should login with valid credentials', async function () {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    console.log('Login Response:', res.body);

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.ok(res.body.user);
  });
});
