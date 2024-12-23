import express from 'express'
const encounterController = require('./encounterController');

console.log('encounterController:', encounterController);

const router = express.Router();

router.get('/', encounterController.getEncounters);
router.post('/', encounterController.createEncounter);
router.put('/:id/complete', encounterController.completeEncounter);
router.get('/:id', encounterController.getEncounter);

router.get('/test', (req, res) => {
    res.json({ message: 'Encounter routes are working' });
  });

export { router as encounterRoutes };