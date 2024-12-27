import * as dataManagementUtil from '../utils/dataManagementUtil.js';

export const clearAllData = async (req, res) => {
  try {
    const result = await dataManagementUtil.clearAllData();
    res.json({
      message: 'All data cleared successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to clear all data', 
      error: error.message 
    });
  }
};

export const clearModelData = async (req, res) => {
  try {
    const { model } = req.params;
    const result = await dataManagementUtil.clearModelData(model);
    res.json({
      message: `${model} data cleared successfully`,
      ...result
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to clear data', 
      error: error.message 
    });
  }
};