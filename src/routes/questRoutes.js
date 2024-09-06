const express = require('express');
const router = express.Router();
const questService = require('../services/questService');

router.get('/quests', questService.getQuests);
router.post('/quests', questService.createQuest);
// ... other quest routes ...

module.exports = router;