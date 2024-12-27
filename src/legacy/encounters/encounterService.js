import { Encounter } from './Encounter.js';
import { characterService } from '../../character/services/CharacterService.js';

class EncounterService {
  /**
   * Get all encounters
   * @returns {Promise<Array<Encounter>>}
   */
  async getEncounters() {
    try {
      return await Encounter.find({});
    } catch (error) {
      console.error('Error fetching encounters:', error);
      throw error;
    }
  }

  /**
   * Get encounter by ID
   * @param {string} encounterId 
   * @returns {Promise<Encounter>}
   */
  async getEncounter(encounterId) {
    try {
      const encounter = await Encounter.findById(encounterId);
      if (!encounter) {
        const error = new Error('Encounter not found');
        error.name = 'NotFoundError';
        throw error;
      }
      return encounter;
    } catch (error) {
      console.error('Error fetching encounter:', error);
      throw error;
    }
  }

  /**
   * Create a new encounter
   * @param {Object} encounterData 
   * @returns {Promise<Encounter>}
   */
  async createEncounter(encounterData) {
    try {
      const encounter = new Encounter(encounterData);
      await encounter.save();
      return encounter;
    } catch (error) {
      console.error('Error creating encounter:', error);
      throw error;
    }
  }

  /**
   * Complete an encounter and process rewards
   * @param {string} encounterId 
   * @param {string} characterId
   * @returns {Promise<Encounter>}
   */
  async completeEncounter(encounterId, characterId) {
    try {
      const encounter = await this.getEncounter(encounterId);
      
      if (encounter.completed) {
        const error = new Error('Encounter already completed');
        error.name = 'ValidationError';
        throw error;
      }

      // Process rewards through characterService
      await Promise.all([
        characterService.gainExperience(characterId, encounter.experienceGained),
        characterService.gainGold(characterId, encounter.goldGained),
        encounter.loot && characterService.acquireLoot(characterId, encounter.loot)
      ]);

      encounter.completed = true;
      await encounter.save();

      return encounter;
    } catch (error) {
      console.error('Error completing encounter:', error);
      throw error;
    }
  }
}

// Export singleton instance for normal use
export const encounterService = new EncounterService();

// Export class for testing (enables dependency injection)
export { EncounterService };