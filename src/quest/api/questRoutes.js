import express from 'express'; 
import { getQuests, createQuest, completeQuest, getQuest } from './questController.js'

const router = express.Router();

router.get('/', getQuests);
router.post('/', createQuest);
router.put('/:id/complete', completeQuest);
router.get('/:id', getQuest);

// ... other quest routes ...

export { router as questRoutes }
