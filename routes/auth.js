const express = require('express');
const passport = require('passport');
const router = express.Router();

// ����������� ����� Steam
router.get('/steam', passport.authenticate('steam'));

// ������� �� Steam ����� �����������
router.get('/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/profile'); // ����� ��������� ����� ������������ �� �������
});

// ����� �� ��������
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
