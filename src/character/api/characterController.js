const characterService = require('../services/CharacterService');
const levelSystem = require('../../utils/gameRules')

exports.getCharacter = async (req, res) => {
  try {
    const character = await characterService.getCharacter();
    res.json(character);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// exports.createCharacter = async (req, res) => {
//   try {
//     const character = await characterService.createCharacter(req.body);
//     res.status(201).json(character);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.updateCharacter = async (req, res) => {
  try {
    const character = await characterService.updateCharacter(req.user.id, req.body); // Assuming you'll have authentication later
    res.json(character);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLevelInfo = async (req, res) => {
  try {
    const character = await characterService.getCharacter();
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    const currentLevel = character.level;
    const currentExp = character.totalExperience;
    const nextLevelExp = levelSystem.getExperienceForNextLevel(currentLevel);

    res.json({
      currentLevel,
      currentExp,
      nextLevelExp,
      expToNextLevel: nextLevelExp - currentExp
    });
  } catch (error) {
      console.error('Error getting level info:', error);
      res.status(500).json({ 
        message: 'Error getting level info', 
        error: error.message 
      });
  }
};

// event sourcing portion starts here
exports.createCharacter = async (req, res) => 
{
  try
  {

    const characterData = req.body;

    if (!characterData.name)
    {
      return res.status(400).json({error: "you must at least provide a name when creating a character"})
    }

    const character = await characterService.createCharacter(req.body)
    res.json(character);

  }
  catch(error)
  {
    res.status(400).json({error: error.message})
  }
}


exports.gainExperience = async (req, res) => 
{
  try
  {
    // you know that you can deconstruct the body this way, contract says those are the payload
    const { characterId, amount } = req.body;

    if (!amount || amount < 0) 
    {
      return res.status(400).json({ error: 'Invalid Experience Amount'});
    }

    const character = await characterService.gainExperience(characterId, amount);
    res.json(character);
  } catch (error) {
    if (error.name == 'ConcurrencyError') 
    {
      res.status(409).json({ error: 'Concurrent5 modification detected' });
    } else if (error.name === 'NotFoundError') 
    {
      res.status(404).json({ error: 'Character not found' });
    } else
    {
      res.status(400).json({ error: error.message });
    }
  }
}