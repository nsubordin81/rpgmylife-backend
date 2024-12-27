import express from 'express'
const router = express.Router();
import { clearAllData, clearModelData } from '../controllers/dataManagementController.js'

// Add some basic protection with a confirmation header
const confirmationMiddleware = (req, res, next) => {
  const confirmation = req.headers['confirm-data-deletion'];
  if (confirmation !== 'yes-i-want-to-delete-data') {
    return res.status(400).json({ 
      message: 'Missing confirmation header' 
    });
  }
  next();
};

router.delete('/all', confirmationMiddleware, clearAllData);
router.delete('/:model', confirmationMiddleware, clearModelData);

export { router as dataManagementRoutes};