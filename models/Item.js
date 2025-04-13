const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  image: String,
  rarity: String,
  price: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isListed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Item', itemSchema);
