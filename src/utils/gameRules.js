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
      return table;
    }
  
    calculateLevel(totalExperience) {
      let level = 0;
      while (level < this.experienceTable.length && 
             totalExperience >= this.experienceTable[level]) {
        level++;
      }
      return level - 1;
    }
  
    getRequiredExperience(level) {
      return this.experienceTable[level] || this.experienceFormula(level);
    }
  
    getExperienceForNextLevel(currentLevel) {
      return this.getRequiredExperience(currentLevel + 1);
    }
  }
  
  // Create singleton instance
  export const levelSystem = new LevelSystem();