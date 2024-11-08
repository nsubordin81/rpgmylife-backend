const express = require('express');
const characterController = require('../controllers/characterController');

const router = express.Router();

router.get('/', characterController.getCharacter);
router.post('/', characterController.createCharacter);
// router.put('/character', characterService.updateCharacter);

module.exports = router;