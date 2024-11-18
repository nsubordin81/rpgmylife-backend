const backupUtil = require('../utils/backupUtil');

exports.createBackup = async (req, res) => {
  try {
    const result = await backupUtil.createBackup();
    res.json({
      message: 'Backup created successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Backup failed', 
      error: error.message 
    });
  }
};