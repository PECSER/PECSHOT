const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const Message = require('../models/Message');
const User = require('../models/User');

router.get('/', ensureAuthenticated, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } });
  res.render('chat', { user: req.user, users });
});

router.get('/:id', ensureAuthenticated, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { from: req.user._id, to: req.params.id },
      { from: req.params.id, to: req.user._id }
    ]
  }).sort('timestamp');

  const target = await User.findById(req.params.id);
  res.render('chat', { user: req.user, messages, target });
});

module.exports = router;
