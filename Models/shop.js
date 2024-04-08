const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  image: {
    type: String, // Store image URL instead of Buffer
    required: true
  }
});

shopSchema.index({ location: '2dsphere' }); // Index for geospatial queries

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;
