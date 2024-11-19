const fs = require('fs/promises');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');
const mongoose = require('mongoose');
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

// Import your models
const Character = require('../models/Character');
const Quest = require('../models/Quest');
const Encounter = require('../models/Encounter');

exports.createBackup = async () => {
  try {
    // Fetch all data from your models
    const gameState = {
      character: await Character.findOne(),  // Since you only have one character
      quests: await Quest.find(),
      encounters: await Encounter.find(),
      timestamp: new Date().toISOString()
    };

    // Create backups directory if it doesn't exist
    const backupDir = path.join(__dirname, '../../backups');
    await fs.mkdir(backupDir, { recursive: true });

    // Compress the data
    const compressed = await gzip(JSON.stringify(gameState));
    
    // Save with timestamp
    const filename = `rpgmylife-backup-${Date.now()}.gz`;
    await fs.writeFile(path.join(backupDir, filename), compressed);

    return {
      filename,
      timestamp: gameState.timestamp,
      stats: {
        character: gameState.character ? 1 : 0,
        quests: gameState.quests.length,
        encounters: gameState.encounters.length
      }
    };
  } catch (error) {
    console.error('Backup creation failed:', error);
    throw error;
  }
};

exports.restoreBackup = async (filename) => {
    try {
      // Read and decompress backup
      const backupDir = path.join(__dirname, '../../backups');
      const compressed = await fs.readFile(path.join(backupDir, filename));
      const data = JSON.parse((await gunzip(compressed)).toString());
  
      // Clear existing data
      await Promise.all([
        Character.deleteMany({}),
        Quest.deleteMany({}),
        Encounter.deleteMany({})
      ]);
  
      // Restore data if it exists
      if (data.character) await Character.create(data.character);
      if (data.quests?.length) await Quest.insertMany(data.quests);
      if (data.encounters?.length) await Encounter.insertMany(data.encounters);
  
      return {
        timestamp: data.timestamp,
        stats: {
          character: data.character ? 1 : 0,
          quests: data.quests?.length || 0,
          encounters: data.encounters?.length || 0
        }
      };
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  };
  
  // Add list backups function
  exports.listBackups = async () => {
    try {
      const backupDir = path.join(__dirname, '../../backups');
      const files = await fs.readdir(backupDir);
      return files.filter(f => f.endsWith('.gz'));
    } catch (error) {
      console.error('Failed to list backups:', error);
      throw error;
    }
  };