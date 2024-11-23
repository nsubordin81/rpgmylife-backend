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

exports.restoreBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const result = await backupUtil.restoreBackup(filename);
    res.json({
      message: 'Backup restored successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Restore failed', 
      error: error.message 
    });
  }
};

exports.listBackups = async (req, res) => {
  try {
    const backups = await backupUtil.listBackups();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to list backups', 
      error: error.message 
    });
  }
};