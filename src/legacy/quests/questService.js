import { Quest } from './Quest.js';
import { characterService } from '../../character/services/CharacterService.js';

class QuestService {
  constructor(dependencies = {}) {
    this.characterService = dependencies.characterService || characterService;
  }

  /**
   * Get all quests
   * @returns {Promise<Array<Quest>>}
   * @throws {Error} Database error
   */
  async getQuests() {
    try {
      const quests = await Quest.find({})
        .sort({ deadline: 1 }) // Sort by deadline
        .lean(); // Performance optimization for read-only data
      return quests;
    } catch (error) {
      console.error('Error fetching quests:', error);
      throw error;
    }
  }

  /**
   * Get a single quest by ID
   * @param {string} questId 
   * @returns {Promise<Quest>}
   * @throws {Error} Quest not found or database error
   */
  async getQuest(questId) {
    try {
      const quest = await Quest.findById(questId);
      if (!quest) {
        const error = new Error('Quest not found');
        error.name = 'NotFoundError';
        throw error;
      }
      return quest;
    } catch (error) {
      console.error('Error fetching quest:', error);
      throw error;
    }
  }

  /**
   * Create a new quest
   * @param {Object} questData Quest creation data
   * @returns {Promise<Quest>}
   * @throws {Error} Validation error or database error
   */
  async createQuest(questData) {
    try {
      // Validate required fields
      if (!questData.name || !questData.description) {
        const error = new Error('Quest name and description are required');
        error.name = 'ValidationError';
        throw error;
      }

      const quest = new Quest({
        ...questData,
        completed: false,
        createdAt: new Date()
      });

      await quest.save();
      return quest;
    } catch (error) {
      console.error('Error creating quest:', error);
      if (error.name === 'ValidationError') {
        // Mongoose validation error
        throw error;
      }
      // Wrap other errors
      const wrappedError = new Error('Failed to create quest');
      wrappedError.cause = error;
      throw wrappedError;
    }
  }

  /**
   * Complete a quest and process rewards
   * @param {string} questId Quest to complete
   * @param {string} characterId Character completing the quest
   * @returns {Promise<Quest>}
   * @throws {Error} Quest not found, already completed, or reward processing error
   */
  async completeQuest(questId, characterId) {
    try {
      const quest = await this.getQuest(questId);
      
      if (quest.completed) {
        const error = new Error('Quest already completed');
        error.name = 'ValidationError';
        throw error;
      }

      if (quest.deadline && new Date() > new Date(quest.deadline)) {
        const error = new Error('Quest deadline has passed');
        error.name = 'ValidationError';
        throw error;
      }

      // Process rewards through characterService
      await Promise.all([
        this.characterService.gainExperience(characterId, quest.expReward),
        this.characterService.gainGold(characterId, quest.goldReward),
        quest.abilityReward && this.characterService.acquireLoot(characterId, {
          type: 'ITEM',
          item: {
            type: 'ability',
            name: quest.abilityReward
          }
        })
      ]);

      // Update quest status
      quest.completed = true;
      quest.completedAt = new Date();
      await quest.save();

      return quest;
    } catch (error) {
      console.error('Error completing quest:', error);
      // Preserve error types from characterService
      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        throw error;
      }
      // Wrap other errors
      const wrappedError = new Error('Failed to complete quest');
      wrappedError.cause = error;
      throw wrappedError;
    }
  }

  /**
   * Delete a quest
   * @param {string} questId Quest to delete
   * @returns {Promise<void>}
   * @throws {Error} Quest not found or database error
   */
  async deleteQuest(questId) {
    try {
      const result = await Quest.findByIdAndDelete(questId);
      if (!result) {
        const error = new Error('Quest not found');
        error.name = 'NotFoundError';
        throw error;
      }
    } catch (error) {
      console.error('Error deleting quest:', error);
      throw error;
    }
  }
}

// Export singleton instance for normal use
export const questService = new QuestService();

// Export class for testing (enables dependency injection)
export { QuestService };