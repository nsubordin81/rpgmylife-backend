const Character = require('../models/Character');
const levelSystem = require('../utils/gameRules');

exports.getCharacter = async () => {
  try {
    console.log('Attempting to find character');
    const character = await Character.findOne();
    console.log('Character query result:', character);
    return character;  // Simply return the character (or null if not found)
  } catch (error) {
    console.error('Error in getCharacter:', error);
    throw error;
  }
};

exports.createCharacter = async (characterData) => {
  try {
    console.log("received character for saving")
    const character = new Character(characterData);
    const savedCharacter = await character.save();
    console.log("character saved successfully")
    return savedCharacter;
  }
  catch (error){
    console.error('Error in createCharacter:', error);
    throw error;
  }
};

exports.updateCharacter = async (userId, updateData) => {
  try {
    // Check if we're using $inc operator
    if (updateData.$inc) {
      const character = await Character.findOne();
      if (!character) {
        throw new Error('Character not found')
      }
   // Calculate new total experience
   const newTotalExp = character.totalExperience + (updateData.$inc.totalExperience || 0);
      
   // Calculate new level based on total experience
   const newLevel = levelSystem.calculateLevel(newTotalExp);
   
   // Add level update if it changed
   if (newLevel !== character.level) {
     updateData.$set = { 
       ...updateData.$set, 
       level: newLevel 
     };
   }

   const updatedCharacter = await Character.findOneAndUpdate(
     {}, 
     { ...updateData },
     { 
       new: true,
       runValidators: true
     }
   );
   return updatedCharacter;
 }

 // Handle regular updates...
} catch (error) {
 console.error('Error in updateCharacter:', error);
 throw error;
}
};

// leaving the above intact because I think I might try that side by side thing. 
// from here down is using the event sourcing pattern

const Character = require('../domain/Character');
// don't know why that gets imported because it is never used
const eventStore = require('../infrastructure/EventStore');

class CharacterService {
  constructor()
  {
    // ok so that is how we are working with the event store, sharing it as an exported class
    this.eventStore = eventStore
  }

  async gainExperience(characterId, amount) {

    // using the characer aggregate object to load the character state by replaying events
    // ok so notice here what happens, we abstracted all of hte event sourcing behind the aggregate
    // the api looks pretty n ormal from this angle, you are loading an object, applying the method, 
    // and then saving the changes. what is really happening in the backgr4ound though is applying all of the 
    // events in the store related to that character and then creating a new event and then saving it to the event store
    const character = await Character.load(characterId);

    character.gainExperience(amount);

    await character.save();

    return character;
  }

  async createCharacter(characterData) {
    const character = new Character(characterData.id);
    // looking at the aggregate I know how this is getting used
    // remember, in the parent class of aggregate we are actually applying the event and versioning it with this call
    character.addEvent('CHARACTER_CREATED', {
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
    const character = await Character.load(characterId);
    character.gainGold(amount);
    await character.save();
    return character;
  }

  async getCharacter(characterId) {
    return Character.load(characterId);
  }
}

module.exports = new CharacterService();