import { gameConfig } from '../config/gameSettings.js'
  
class LevelSystem {
    constructor(formula = gameConfig.levelFormula) {
      this.experienceFormula = formula;
      this.experienceTable = this.generateExperienceTable();
    }
  
    generateExperienceTable(maxLevel = 100) {
      const table = [0]; // Level 0 requires 0 exp
      for (let i = 1; i <= maxLevel; i++) {
        table[i] = this.experienceFormula(i);
      }
      console.log(`value at index 0 of experience table is ${table[0]}`);
      return table;
    }
  
    calculateLevel(totalExperience) {
      let level = 1;
      while (level < this.experienceTable.length && 
             totalExperience >= this.experienceTable[level]) {
        level++;
      }
      return level;
    }
  
    getRequiredExperience(level) {
      let requiredExp = this.experienceTable[level];
      if (requiredExp === 'undefined') {
        requiredExp = this.experienceFormula(level);
      }
      // console.log(`the first 10 elements of experience table are ${this.experienceTable.slice(0, 10)}`);
      console.log(`Level ${level} requires ${requiredExp} experience.`);
      return requiredExp;
    }
  
    getExperienceForNextLevel(currentLevel) {
      return this.getRequiredExperience(currentLevel + 1);
    }
  }
  
  // Create singleton instance
  export const levelSystem = new LevelSystem();