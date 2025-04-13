const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  // ?? �������� ��������
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ??? �������� ��������
  name: {
    type: String,
    required: true
  },

  // ??? ��������
  image: {
    type: String,
    required: true
  },

  // ?? ��������
  rarity: {
    type: String,
    enum: ['common', 'industrial', 'mil-spec', 'restricted', 'classified', 'covert', 'rare'],
    default: 'common'
  },

  // ?? ������� ���� (�� ��������� �������������)
  price: {
    type: Number,
    default: 10,
    min: 0
  },

  // ? �������, ��������� �� ������� �� ������
  listed: {
    type: Boolean,
    default: false
  },

  // ?? ����, �� ������� ������������ ����� ������� (���������� �� �������)
  marketPrice: {
    type: Number,
    min: 0
  },

  // ?? �������� ��������� ��� ����� (���� ����)
  collection: {
    type: String
  },

  // ?? ���� ���������
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ?? ��������� ������ �� ������������ � ����� ��� �������� ������
InventoryItemSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
