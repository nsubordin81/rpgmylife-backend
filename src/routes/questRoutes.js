const express = require('express');
const questController = require('../controllers/questController');

const router = express.Router();

router.get('/', questController.getQuests);
router.post('/', questController.createQuest);
router.put('/:id/complete', questController.completeQuest);

module.exports = router;