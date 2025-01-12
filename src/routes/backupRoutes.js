import express from 'express';
const router = express.Router();
import { createBackup, restoreBackup, listBackups } from '../controllers/backupController.js';

router.post('/create', createBackup);
router.post('/restore/:filename', restoreBackup);
router.get('/list', listBackups);

export {router as backupRoutes}