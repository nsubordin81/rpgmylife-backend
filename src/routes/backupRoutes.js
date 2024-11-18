const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');

router.post('/create', backupController.createBackup);

module.exports = router;