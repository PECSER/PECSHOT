const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

router.get('/sell', (req, res) => {
  const { id, name, image, price } = req.query;

  if (!id || !name || !image || !price) {
    return res.status(400).send('Недостаточно данных для продажи');
  }

  res.render('sell', {
    id,
    name: decodeURIComponent(name),
    image,
    price
  });
});

module.exports = router;
