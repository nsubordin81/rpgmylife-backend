import express from 'express'
import { getEncounters, getEncounter, createEncounter, completeEncounter } from './encounterController.js';
import { getEncounter as getEncounterV2, getEncounters as getEncountersV2, createEncounter as createEncounterV2, completeEncounter as completeEncounterV2} from '../../encounter/api/encounterController.js';

const router = express.Router();

router.get('/', getEncounters);
router.post('/', createEncounter);
router.put('/:id/complete', completeEncounter);
router.get('/:id', getEncounter);

router.get('/v2/', getEncountersV2);
router.post('/v2/', createEncounterV2);
router.get('/v2/:id', getEncounterV2);
router.get('/v2/:id/complete', completeEncounterV2);

router.get('/test', (req, res) => {
    res.json({ message: 'Encounter routes are working' });
  });

export { router as encounterRoutes };