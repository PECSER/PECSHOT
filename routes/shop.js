const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');

const Listing = require('../models/Listing');
const User = require('../models/User');
const InventoryItem = require('../models/InventoryItem');

// Главная страница магазина
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const listings = await Listing.find().populate('seller');

    const { id, name, image, price, openSellModal, message } = req.query;

    res.render('shop', {
      user: req.user,
      listings,
      id,
      name,
      image,
      price,
      openSellModal: openSellModal === 'true',
      message
    });
  } catch (err) {
    console.error('[Ошибка загрузки магазина]:', err.message);
    res.status(500).send('Ошибка загрузки магазина');
  }
});

// Переход с инвентаря на продажу
router.get('/sell', ensureAuthenticated, (req, res) => {
  const { id, name, image, price } = req.query;

  if (!id || !name || !image || !price) {
    return res.redirect('/shop?message=' + encodeURIComponent('Недостаточно данных для продажи'));
  }

  const redirectUrl = `/shop?id=${id}&name=${encodeURIComponent(name)}&image=${encodeURIComponent(image)}&price=${price}&openSellModal=true`;
  res.redirect(redirectUrl);
});

// Подтверждение продажи
router.post('/confirm-sell', ensureAuthenticated, async (req, res) => {
  const { id, name, image, price, action } = req.body;

  try {
    console.log('[Запрос на продажу]:', req.body);

    const item = await InventoryItem.findOne({ _id: id, user: req.user._id });

    if (!item) {
      return res.redirect('/shop?message=' + encodeURIComponent('Предмет не найден или не принадлежит вам.'));
    }

    const parsedPrice = parseInt(price);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.redirect('/shop?message=' + encodeURIComponent('Некорректная цена.'));
    }

    if (action === 'coins') {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { coins: parsedPrice }
      });

      await InventoryItem.deleteOne({ _id: id });

      return res.redirect('/inventory?message=' + encodeURIComponent(`${name} продан за ${parsedPrice} коинов`));
    }

    if (action === 'market') {
      item.listed = true;
      item.marketPrice = parsedPrice;
      await item.save();

      const newListing = new Listing({
        item: {
          id: item._id,
          name: item.name,
          image: item.image
        },
        price: parsedPrice,
        seller: req.user._id
      });

      await newListing.save();

      return res.redirect('/shop?message=' + encodeURIComponent(`${name} выставлен на продажу за ${parsedPrice} коинов`));
    }

    return res.redirect('/shop?message=' + encodeURIComponent('Неизвестное действие.'));
  } catch (err) {
    console.error('[Ошибка при продаже]:', err);
    return res.redirect('/shop?message=' + encodeURIComponent('Ошибка при продаже предмета.'));
  }
});

// Снять предмет с продажи
router.post('/remove-listing', ensureAuthenticated, async (req, res) => {
  const { listingId, itemId } = req.body;

  try {
    const listing = await Listing.findOne({ _id: listingId, seller: req.user._id });
    if (!listing) {
      return res.redirect('/shop?message=' + encodeURIComponent('Лот не найден или вы не владелец.'));
    }

    await Listing.deleteOne({ _id: listingId });

    await InventoryItem.findOneAndUpdate(
      { _id: itemId, user: req.user._id },
      { $set: { listed: false, marketPrice: null } }
    );

    return res.redirect('/shop?message=' + encodeURIComponent('Лот снят с продажи.'));
  } catch (err) {
    console.error('[Ошибка снятия с продажи]:', err.message);
    return res.redirect('/shop?message=' + encodeURIComponent('Ошибка при снятии лота с продажи.'));
  }
});

module.exports = router;
