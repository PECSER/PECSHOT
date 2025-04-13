const mongoose = require('mongoose');

const SkinSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  image: String,
  rarity: String,
  price: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skin', SkinSchema);
