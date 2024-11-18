const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');

router.post('/create', backupController.createBackup);
router.post('/restore/:filename', backupController.restoreBackup);
router.get('/list', backupController.listBackups);

module.exports = router;