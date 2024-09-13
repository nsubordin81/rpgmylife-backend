const express = require('express');
const encounterController = require('../controllers/encounterController');
const encounterService = require('../services/encounterService');

const router = express.Router();

router.get('/', encounterController.getEncounters);
router.post('/', encounterController.createEncounter);
router.put('/:id/complete', encounterController.completeEncounter);
router.get('/:id', encounterController.getEncounter);

module.exports = router;