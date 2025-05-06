const mongoose = require('mongoose');
const config = require('../config/test');

before(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});


after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});