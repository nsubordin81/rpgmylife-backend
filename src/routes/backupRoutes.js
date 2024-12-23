import express from 'express';
const router = express.Router();
import {backupController} from '../controllers/backupController';
const backupController = require('../controllers/backupController');

router.post('/create', backupController.createBackup);
router.post('/restore/:filename', backupController.restoreBackup);
router.get('/list', backupController.listBackups);

export {router as backuRoutes}