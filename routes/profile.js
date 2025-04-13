const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const Item = require('../models/Item');

router.get('/', ensureAuthenticated, async (req, res) => {
  const items = await Item.find({ owner: req.user._id });
  res.render('profile', { user: req.user, items });
});

module.exports = router;
