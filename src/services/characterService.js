const Character = require('../models/Character');

exports.getCharacter = async () => {
  try {
    const character = await Character.findOne();
    if (!character) {
      console.log('No character found in the database');
      throw new Error('No character found');
    }
    return character;
  } catch (error) {
    console.error('Error in getCharacter:', error);
    throw error;
  }
};

exports.createCharacter = async (characterData) => {
  const character = new Character(characterData);
  await character.save();
  return character;
};

exports.updateCharacter = async (userId, updateData) => {
  // For now, we'll just update the first character. In a real app, you'd filter by user ID.
  const character = await Character.findOneAndUpdate({}, updateData, { new: true });
  if (!character) {
    throw new Error('Character not found');
  }
  return character;
};