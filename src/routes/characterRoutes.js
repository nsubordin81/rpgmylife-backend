const express = require('express');
const characterController = require('../controllers/characterController');

const router = express.Router();

router.get('/', characterController.getCharacter);
router.post('/', characterController.createCharacter);
router.put('/', characterController.updateCharacter);

module.exports = router;