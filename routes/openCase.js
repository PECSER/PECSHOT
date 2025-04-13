const express = require('express');
const router = express.Router();
const casesData = require('../data/cases.json');

router.get('/cases/:caseName', (req, res) => {
  const caseName = decodeURIComponent(req.params.caseName);
  const allCases = [
    ...(casesData.freeCases || []),
    ...(casesData.thematicCases || []),
    ...(casesData.regularCases || [])
  ];

  const selectedCase = allCases.find(c => c.name === caseName);

  if (!selectedCase) {
    return res.status(404).send('Кейс не найден');
  }

  res.render('cases', {
    user: req.user,
    caseData: selectedCase
  });
});

module.exports = router;
