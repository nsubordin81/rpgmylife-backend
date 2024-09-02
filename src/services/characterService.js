const Character = require('../models/Character');

exports.getCharacter = async () => {
  const character = await Character.findOne();
  if (!character) {
    throw new Error('No character found');
  }
  return character;
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