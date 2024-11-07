const Character = require('../models/Character');

exports.getCharacter = async (req, res) => {
  console.log('getCharacter function called');
  try {
    console.log('Attempting to find character');
    const character = await Character.findOne();
    console.log('Character query result:', character);
    if (!character) {
      console.log('Character collection is empty');
      return res.status(200).json(null); 
    }
    console.log('Sending character data');
    res.json(character);
  } catch (error) {
    console.error('Error in getCharacter:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.createCharacter = async (req, res) => {
  try {
  console.log("received character for saving")
  const character = new Character(req.body);
  const savedCharacter = await character.save();
  console.log("character saved successfully")
  res.status(201).json(savedCharacter);
  }
  catch (error){
    console.error('Error in createCharacter:', error);
    res.status(500).json({message: 'Internal Sever error', error: error.message})
  }
};

exports.updateCharacter = async (userId, updateData) => {
  // For now, we'll just update the first character. In a real app, you'd filter by user ID.
  const character = await Character.findOneAndUpdate({}, updateData, { new: true });
  if (!character) {
    throw new Error('Character not found');
  }
  return character;
};