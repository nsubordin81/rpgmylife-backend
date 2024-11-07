const express = require('express');
const characterService = require('../services/characterService');

const router = express.Router();

router.get('/', characterService.getCharacter);
router.post('/', characterService.createCharacter);
// router.put('/character', characterService.updateCharacter);

module.exports = router;