const express = require('express');
const router = express.Router();

const User = require('../models/User');
const InventoryItem = require('../models/InventoryItem');
const Listing = require('../models/Listing');

// Middleware � �������� �� �����������
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect('/auth/steam');
}

// �������� ��������� �� MongoDB
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const inventory = await InventoryItem.find({ user: req.user._id });
    const sellMode = req.query.sellMode === 'true';

    // ?? ��� ��� ���������: ������� user
    res.render('inventory', {
      inventory,
      sellMode,
      user: req.user // ?? ����������� ������� ���� ������ ������������
    });
  } catch (err) {
    console.error('������ �������� ���������:', err);
    res.status(500).send('������ �������');
  }
});

// �������� ������� � ���������
router.post('/add', isLoggedIn, async (req, res) => {
  const { name, image, rarity, price } = req.body;

  if (!name || !image) {
    return res.status(400).json({ success: false, message: '������������ ������' });
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
    return res.json({ success: true, message: '������� ��������' });
  } catch (err) {
    console.error('������ ���������� ��������:', err);
    return res.status(500).json({ success: false, message: '������ �������' });
  }
});

// ������� ������� �� �����
router.post('/sell', isLoggedIn, async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID �������� �� ������' });
  }

  try {
    const item = await InventoryItem.findOneAndDelete({ _id: id, user: req.user._id });
    if (!item) return res.json({ success: false, message: '������� �� ������' });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        balance: item.price,
        'stats.soldItems': 1
      }
    });

    return res.json({ success: true, message: '������� ������� ������' });
  } catch (err) {
    console.error('������ �������:', err);
    return res.status(500).json({ success: false, message: '������ �������' });
  }
});

// ��������� ������� �� ������
router.post('/market/add', isLoggedIn, async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID �������� �� ������' });
  }

  try {
    const item = await InventoryItem.findOneAndDelete({ _id: id, user: req.user._id });
    if (!item) return res.json({ success: false, message: '������� �� ������' });

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

    return res.json({ success: true, message: '������� ��������� �� ������' });
  } catch (err) {
    console.error('������ ��� ����������� �� ������:', err);
    return res.status(500).json({ success: false, message: '������ �������' });
  }
});

module.exports = router;
