const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemsFrom: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  itemsTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', tradeSchema);
