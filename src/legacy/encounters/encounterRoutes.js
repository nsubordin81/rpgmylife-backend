import express from 'express'
import { getEncounters, getEncounter, createEncounter, completeEncounter } from './encounterController.js';

const router = express.Router();

router.get('/', getEncounters);
router.post('/', createEncounter);
router.put('/:id/complete', completeEncounter);
router.get('/:id', getEncounter);

router.get('/test', (req, res) => {
    res.json({ message: 'Encounter routes are working' });
  });

export { router as encounterRoutes };