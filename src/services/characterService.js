const Character = require('../models/Character');

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
      const character = await Character.findOneAndUpdate(
        {}, // For now, still updating first character
        updateData,
        { 
          new: true,      // Return updated document
          runValidators: true  // Run schema validators on update
        }
      );
      if (!character) {
        throw new Error('Character not found');
      }
      return character;
    }

    // Handle regular updates (non-incremental)
    const character = await Character.findOneAndUpdate(
      {}, 
      { $set: updateData },  // Use $set for regular updates
      { 
        new: true,
        runValidators: true 
      }
    );
    if (!character) {
      throw new Error('Character not found');
    }
    return character;
  } catch (error) {
    console.error('Error in updateCharacter:', error);
    throw error;
  }
};