const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  // ?? Владелец предмета
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ??? Название предмета
  name: {
    type: String,
    required: true
  },

  // ??? Картинка
  image: {
    type: String,
    required: true
  },

  // ?? Редкость
  rarity: {
    type: String,
    enum: ['common', 'industrial', 'mil-spec', 'restricted', 'classified', 'covert', 'rare'],
    default: 'common'
  },

  // ?? Базовая цена (по умолчанию внутриигровая)
  price: {
    type: Number,
    default: 10,
    min: 0
  },

  // ? Признак, выставлен ли предмет на маркет
  listed: {
    type: Boolean,
    default: false
  },

  // ?? Цена, по которой пользователь хочет продать (отличается от базовой)
  marketPrice: {
    type: Number,
    min: 0
  },

  // ?? Название коллекции или кейса (если есть)
  collection: {
    type: String
  },

  // ?? Дата получения
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ?? Добавляем индекс по пользователю и имени для быстрого поиска
InventoryItemSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
