const fs = require('fs/promises');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');
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