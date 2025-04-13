const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

module.exports = mongoose.model('Case', caseSchema);
