const Character = require('../models/Character');

exports.getCharacter = async (req, res) => {
  console.log('getCharacter function called');
  try {
    console.log('Attempting to find character');
    const character = await Character.findOne();
    console.log('Character query result:', character);
    if (!character) {
      console.log('No character found');
      return res.status(404).json({ message: 'No character found' });
    }
    console.log('Sending character data');
    res.json(character);
  } catch (error) {
    console.error('Error in getCharacter:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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