const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');

router.get('/', questController.getQuests);
router.post('/', questController.createQuest);
router.put('/:id/complete', questController.completeQuest);
router.get('/:id', questController.getQuest);


// ... other quest routes ...

module.exports = router;