const express = require('express');
const characterController = require('../controllers/characterController');

const router = express.Router();

router.get('/', characterController.getCharacter);
router.post('/', characterController.createCharacter);
router.get('/level-info', characterController.getLevelInfo)
// router.put('/character', characterService.updateCharacter);

module.exports = router;