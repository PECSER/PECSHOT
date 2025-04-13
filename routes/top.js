const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const User = require('../models/User');

router.get('/', ensureAuthenticated, async (req, res) => {
  const topUsers = await User.find().sort({ 'stats.openedCases': -1 }).limit(10);
  res.render('top', { user: req.user, topUsers });
});

module.exports = router;
