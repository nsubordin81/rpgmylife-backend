const characterService = require('../services/characterService');

exports.getCharacter = async (req, res) => {
  try {
    const character = await characterService.getCharacter();
    res.json(character);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createCharacter = async (req, res) => {
  try {
    const character = await characterService.createCharacter(req.body);
    res.status(201).json(character);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCharacter = async (req, res) => {
  try {
    const character = await characterService.updateCharacter(req.user.id, req.body); // Assuming you'll have authentication later
    res.json(character);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};