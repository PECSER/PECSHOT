const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const Trade = require('../models/Trade');

router.get('/', ensureAuthenticated, async (req, res) => {
  const trades = await Trade.find({ $or: [{ from: req.user._id }, { to: req.user._id }] }).populate('itemsFrom itemsTo from to');
  res.render('trade', { user: req.user, trades });
});

module.exports = router;
