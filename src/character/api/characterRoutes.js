// this is the  entry point for the api, where rest calls are handled by the express module
// what do you think is happening there? Well express is a web server running on node, 
// so there is probably a node event loop and then as new http requests come in, the web server is capable of 
// handling them  and there is probably some instrumentation going on so that node and express can work together for
// good concurrency as well as supporting the restful request as an incoming http request. 

import express from 'express';
import { createCharacter, getCharacter, gainExperience, gainGold, spendGold, getLevelInfo } from './characterController.js';

const router = express.Router();

// the router knows h .  so these are handlers that are defined in the routes
router.post('/', createCharacter);
// Get current character (no ID needed)
router.get('/', getCharacter);
router.get('/:id/level-info', getLevelInfo);
router.get('/:id', getCharacter);
router.post('/:id/experience', gainExperience);
router.post('/:id/gold', gainGold);
router.post('/:id/spend', spendGold);

export { router as characterRoutes };
