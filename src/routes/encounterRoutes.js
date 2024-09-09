const express = require('express');
const encounterController = require('../controllers/encounterController');
const encounterService = require('../services/encounterService');

const router = express.Router();

router.get('/', encounterService.getEncounters);
router.post('/', encounterService.createEncounter);
router.put('/:id/complete', encounterController.completeEncounter);

module.exports = router;