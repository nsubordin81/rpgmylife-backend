const express = require('express');
const router = express.Router();
const dataManagementController = require('../controllers/dataManagementController');

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

router.delete('/all', confirmationMiddleware, dataManagementController.clearAllData);
router.delete('/:model', confirmationMiddleware, dataManagementController.clearModelData);

module.exports = router;