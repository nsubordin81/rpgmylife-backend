const express = require('express');
const encounterController = require('../controllers/encounterController');
const encounterService = require('../services/encounterService');

console.log('encounterController:', encounterController);

const router = express.Router();

router.get('/', encounterController.getEncounters);
router.post('/', encounterController.createEncounter);
router.put('/:id/complete', encounterController.completeEncounter);
router.get('/:id', encounterController.getEncounter);

router.get('/test', (req, res) => {
    res.json({ message: 'Encounter routes are working' });
  });

module.exports = router;