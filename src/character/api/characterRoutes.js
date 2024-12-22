// this is the  entry point for the api, where rest calls are handled by the express module
// what do you think is happening there? Well express is a web server running on node, 
// so there is probably a node event loop and then as new http requests come in, the web server is capable of 
// handling them  and there is probably some instrumentation going on so that node and express can work together for
// good concurrency as well as supporting the restful request as an incoming http request. 


const express = require('express');
const router = express.Router();
const characterController = require('./characterController');


// the router knows h .  so these are handlers that are defined in the routes
router.post('/', characterController.createCharacter);
router.get('/:id', characterController.getCharacter);
router.post('/:id/experience', characterController.gainExperience);
router.post('/:id/gold', characterController.gainGold);
router.post('/:id/spend', characterController.spendGold);
router.get('/:id/level-info', characterController.getLevelInfo);
