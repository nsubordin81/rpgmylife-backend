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
    return character;
  }

  async createCharacter(characterData) {
    const character = new Character(characterData.id);
    character.addEvent(CHARACTER_EVENTS.CHARACTER_CREATED, {
      name: characterData.name,
      race: characterData.race,
      class: characterData.class
    });
    await character.save();
    return character;
  }

  async gainGold(characterId, amount) {
    const character = await this.getCharacter(characterId);
    character.gainGold(amount);
    await character.save();
    return character;
  }

  async spendGold(characterId, amount) {
    const character = await this.getCharacter(characterId);
    character.spendGold(amount);
    await character.save();
    return character;
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
    return character;
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
      return null;
    }
    
    // Use the characterId from the creation event to load the full character
    return this.getCharacter(createEvent.characterId);
  }
}

export const characterService = new CharacterService();
// keeping export of the class itself so that we can still inject instance for tests
export { CharacterService }