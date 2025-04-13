const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const User = require('../models/User');

router.get('/', ensureAuthenticated, async (req, res) => {
  const query = req.query.q || '';
  const results = await User.find({ personaname: { $regex: query, $options: 'i' } });
  res.render('search', { user: req.user, results });
});

module.exports = router;
