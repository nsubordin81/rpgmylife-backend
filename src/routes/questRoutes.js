const express = require('express');
const router = express.Router();
const questService = require('../services/questService');

router.get('/', questService.getQuests);
router.post('/', questService.createQuest);
// ... other quest routes ...

module.exports = router;