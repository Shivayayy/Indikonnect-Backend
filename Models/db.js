const mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Database connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
