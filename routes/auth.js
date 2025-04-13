const express = require('express');
const passport = require('passport');
const router = express.Router();

// Авторизация через Steam
router.get('/steam', passport.authenticate('steam'));

// Возврат от Steam после авторизации
router.get('/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/profile'); // после успешного входа перекидывает на профиль
});

// Выход из аккаунта
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
