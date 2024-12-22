const characterService = require('../services/CharacterService');
const levelSystem = require('../../utils/gameRules');
const CharacterService = require('../services/CharacterService');


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

exports.gainGold = async (req, res) => 
{
  try 
  {
    const {characterId, amount } = req.body

    if (!amount || amount < 0)
    {
      return res.status(400).json({ error: 'Invalid Gold Amount'})
    }

    const character = await characterService.gainGold(characterId, amount);
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

exports.spendGold = async (req, res) =>
{
  try 
  {

    const { characterId, amount } = req.body;

    if (!amount || amount < 0)
    {
      return res.status(400).json({ error: 'Invalid Gold Amount'})
    }

    const character = await characterService.gainGold(characterId, amount);
    res.json(character)
  }  catch (error) {
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
