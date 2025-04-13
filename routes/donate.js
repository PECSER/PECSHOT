const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('donate', { user: req.user });
});

module.exports = router;
