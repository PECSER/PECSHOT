const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  steamId: { type: String, required: true, unique: true },
  personaname: { type: String, required: true },
  avatar: { type: String, default: '' },

  inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' }],

  balance: {
    type: Number,
    default: 0,
    min: 0
  },

  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],

  stats: {
    openedCases: { type: Number, default: 0 },
    trades: { type: Number, default: 0 },
    soldItems: { type: Number, default: 0 },
    boughtItems: { type: Number, default: 0 }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
