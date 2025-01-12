import express from 'express'; 
const router = express.Router();
import {questController} from './questController.js'

router.get('/', questController.getQuests);
router.post('/', questController.createQuest);
router.put('/:id/complete', questController.completeQuest);
router.get('/:id', questController.getQuest);


// ... other quest routes ...

export { router as questRoutes }
