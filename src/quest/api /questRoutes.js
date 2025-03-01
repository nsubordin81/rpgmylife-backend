import express from 'express'; 
const router = express.Router();
import { getQuests, createQuest, completeQuest, getQuest } from './questController.js'

router.get('/', getQuests);
router.post('/', createQuest);
router.put('/:id/complete', completeQuest);
router.get('/:id', getQuest);

// ... other quest routes ...

export { router as questRoutes }
