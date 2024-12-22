const Character = require('../domain/Character');
// don't know why that gets imported because it is never used
const eventStore = require('../../shared/eventStore/EventStore');
const { CHARACTER_EVENTS } = require('../events/characterEvents')

class CharacterService {
  constructor()
  {
    // ok so that is how we are working with the event store, sharing it as an exported class
    this.eventStore = eventStore
  }

  async gainExperience(characterId, amount) {
    const character = await this.getCharacter(characterId);
    character.gainExperience(amount);
    await character.save();
    return character;
  }

  async createCharacter(characterData) {
    const character = new Character(characterData.id);
    // looking at the aggregate I know how this is getting used
    // remember, in the parent class of aggregate we are actually applying the event and versioning it with this call
    character.addEvent(CHARACTER_EVENTS.CHARACTER_CREATED, {
      name: characterData.name,
      race: characterData.race,
      class: characterData.class
    });
    // ah, so here is where we are saving that event to the character
    // maybe would be useful at some point to ask why we are going through the whole rigamarole of adding the event, applying it, and then waiting to save the event to the event store until 
    // after the application has successfully gone through. I know we wouldn't want ot save teh event if it didn't take, but what if the save fails? we've still updated the character's projection
    await character.save();
    return character;
  }

  async gainGold(characterId, amount) {
    const character = await this.getCharacter(characterId);
    character.gainGold(amount);
    await character.save();
    return character;
  }

  async spendGold(characterId, amount)
  {
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

  async getCharacter(characterId) {
    return Character.load(characterId);
  }
}

module.exports = new CharacterService();