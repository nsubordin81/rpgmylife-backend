import Character from '../domain/Character.js';
import { eventStore } from '../../shared/eventStore/EventStore.js';
import { CHARACTER_EVENTS } from '../events/characterEvents.js';
import { levelSystem } from '../../utils/gameRules.js'

class CharacterService {
  constructor() {
    this.eventStore = eventStore;
  }

  async gainExperience(characterId, amount) {
    const character = await this.getCharacter(characterId);
    character.gainExperience(amount);
    await character.save();
    return character.toDTO();
  }

  async createCharacter(characterData) {
    try {
      if (!characterData) {
        throw new Error('Character data is required');
      }

      const character = Character.create(characterData);

      // following the convention that the character aggregate is responsible for managing the events related to it in member functions
      // this class doesn't even know event sourcing is happening exceept for maybe the explicitg save logic
      await character.save();
      return character.toDTO();
    } catch (error) {
      console.error('Error creating character:', error);
      throw new Error(`Failed to create character: ${error.message}`);
    }
  }

  async gainGold(characterId, amount) {
    const character = await this.getCharacter(characterId);
    character.gainGold(amount);
    await character.save();
    return character.toDTO();
  }

  async spendGold(characterId, amount) {
    const character = await this.getCharacter(characterId);
    character.spendGold(amount);
    await character.save();
    return character.toDTO();
  }

  async getLevelInfo(characterId) {
    const character = await this.getCharacter(characterId);
    const nextLevelExp = levelSystem.getExperienceForNextLevel(character.level);

    return {
      currentLevel: character.level,
      currentExp: character.totalExperience,
      nextLevelExp,
      expToNextLevel: nextLevelExp - character.totalExperience
    };
  }

  async acquireLoot(characterId, loot) {
    const character = await Character.load(characterId);
    character.acquireLoot(loot);
    await character.save();
    return character.toDTO();
  }

  async getCharacter(characterId) {
    return Character.load(characterId);
  }

  async getFirstCharacter() {
    // Get all character events without filtering by characterId
    const events = await this.eventStore.find({
      type: CHARACTER_EVENTS.CHARACTER_CREATED
    });
    
    // Get the first creation event
    const createEvent = events[0];
    
    if (!createEvent) {
      console.log("no prior character creation event in database")

      return null;
    }

    console.log(`this is the character creation event ${createEvent}`);
    
    // Use the characterId from the creation event to load the full character
    return this.getCharacter(createEvent.characterId);
  }
}

export const characterService = new CharacterService();
// keeping export of the class itself so that we can still inject instance for tests
export { CharacterService }