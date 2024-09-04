const express = require('express');
const encounterController = require('../controllers/encounterController');

const router = express.Router();

router.get('/', encounterController.getEncounters);
router.post('/', encounterController.createEncounter);
router.put('/:id/complete', encounterController.completeEncounter);

module.exports = router;