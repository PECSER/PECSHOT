const express = require('express');
const router = express.Router();

const User = require('../models/User');
const InventoryItem = require('../models/InventoryItem');
const Listing = require('../models/Listing');

// Middleware — проверка на авторизацию
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect('/auth/steam');
}

// Получить инвентарь из MongoDB
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const inventory = await InventoryItem.find({ user: req.user._id });
    const sellMode = req.query.sellMode === 'true';

    // ?? Вот это добавлено: передаём user
    res.render('inventory', {
      inventory,
      sellMode,
      user: req.user // ?? обязательно передаём сюда объект пользователя
    });
  } catch (err) {
    console.error('Ошибка загрузки инвентаря:', err);
    res.status(500).send('Ошибка сервера');
  }
});

// Добавить предмет в инвентарь
router.post('/add', isLoggedIn, async (req, res) => {
  const { name, image, rarity, price } = req.body;

  if (!name || !image) {
    return res.status(400).json({ success: false, message: 'Недостаточно данных' });
  }

  try {
    const newItem = new InventoryItem({
      user: req.user._id,
      name,
      image,
      rarity: rarity || 'common',
      price: price || 0,
      listed: false,
      marketPrice: null
    });

    await newItem.save();
    return res.json({ success: true, message: 'Предмет добавлен' });
  } catch (err) {
    console.error('Ошибка добавления предмета:', err);
    return res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Продать предмет за коины
router.post('/sell', isLoggedIn, async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID предмета не указан' });
  }

  try {
    const item = await InventoryItem.findOneAndDelete({ _id: id, user: req.user._id });
    if (!item) return res.json({ success: false, message: 'Предмет не найден' });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        balance: item.price,
        'stats.soldItems': 1
      }
    });

    return res.json({ success: true, message: 'Предмет успешно продан' });
  } catch (err) {
    console.error('Ошибка продажи:', err);
    return res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Выставить предмет на маркет
router.post('/market/add', isLoggedIn, async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID предмета не указан' });
  }

  try {
    const item = await InventoryItem.findOneAndDelete({ _id: id, user: req.user._id });
    if (!item) return res.json({ success: false, message: 'Предмет не найден' });

    const listing = new Listing({
      item: {
        name: item.name,
        image: item.image
      },
      price: item.price,
      seller: req.user._id,
      createdAt: new Date()
    });

    await listing.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { listings: listing._id }
    });

    return res.json({ success: true, message: 'Предмет выставлен на маркет' });
  } catch (err) {
    console.error('Ошибка при выставлении на маркет:', err);
    return res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

module.exports = router;
