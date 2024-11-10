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