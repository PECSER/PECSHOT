const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  item: {
    name: String,
    image: String
  },
  price: Number,
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', listingSchema);
