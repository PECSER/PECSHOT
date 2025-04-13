const express = require('express');
const router = express.Router();
const casesData = require('../data/cases.json');
const { ensureAuthenticated } = require('../middlewares/auth');

// Главная страница со всеми кейсами
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('cases', {
    user: req.user,
    freeCases: casesData.freeCases || [],
    thematicCases: casesData.thematicCases || [],
    regularCases: casesData.regularCases || []
  });
});

// Собираем все кейсы в один массив
const allCases = [
  ...(casesData.freeCases || []),
  ...(casesData.thematicCases || []),
  ...(casesData.regularCases || [])
];

// Страница конкретного кейса
router.get('/:name', ensureAuthenticated, (req, res) => {
  const caseName = decodeURIComponent(req.params.name);
  const foundCase = allCases.find(c => c.name === caseName);

  if (!foundCase) {
    return res.status(404).send('Кейс не найден');
  }

  res.render('case', {
    user: req.user,
    caseData: foundCase
  });
});

module.exports = router;
