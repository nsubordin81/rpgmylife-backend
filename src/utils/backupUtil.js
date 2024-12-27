import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import mongoose from 'mongoose';
import Character from '../character/domain/Character.js';
import { Quest } from '../legacy/quests/Quest.js';
import { Encounter } from '../legacy/encounters/Encounter.js';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export const createBackup = async () => {
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

export const restoreBackup = async (filename) => {
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
export const listBackups = async () => {
  try {
    const backupDir = path.join(__dirname, '../../backups');
    const files = await fs.readdir(backupDir);
    return files.filter(f => f.endsWith('.gz'));
  } catch (error) {
    console.error('Failed to list backups:', error);
    throw error;
  }
};