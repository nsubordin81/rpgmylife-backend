import { characterService } from "../services/CharacterService.js";

export const createCharacter = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const characterData = req.body;
    if (!characterData.name) {
      return res.status(400).json({ error: "you must at least provide a name when creating a character" })
    }
    const character = await characterService.createCharacter(req.body);
    res.status(201).json(character);
  }
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getCharacter = async (req, res) => {
  try {
    const characterId = req.params.id;
    let character;

    if (characterId) {
      character = await characterService.getCharacter(characterId);
    } else {
      console.log('character id not provided, getting first available character')
      character = await characterService.getFirstCharacter();
      console.log('retrieved character info: ' + character);
    }

    if (!character) {
      return res.status(404).json({ message: 'No character found' });
    }

    res.json(character);
  } catch (error) {
    console.error('Error getting character:', error);
    res.status(500).json({ message: 'Error getting character' });
  }
};

export const gainExperience = async (req, res) => {
  try {
    // you know that you can deconstruct the body this way, contract says those are the payload
    const { characterId, amount } = req.body;

    if (!amount || amount < 0) {
      return res.status(400).json({ error: 'Invalid Experience Amount' });
    }

    const character = await characterService.gainExperience(characterId, amount);
    res.json(character);
  } catch (error) {
    if (error.name == 'ConcurrencyError') {
      res.status(409).json({ error: 'Concurrent5 modification detected' });
    } else if (error.name === 'NotFoundError') {
      res.status(404).json({ error: 'Character not found' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}

export const gainGold = async (req, res) => {
  try {
    const { characterId, amount } = req.body

    if (!amount || amount < 0) {
      return res.status(400).json({ error: 'Invalid Gold Amount' })
    }

    const character = await characterService.gainGold(characterId, amount);
    res.json(character);
  } catch (error) {
    if (error.name == 'ConcurrencyError') {
      res.status(409).json({ error: 'Concurrent5 modification detected' });
    } else if (error.name === 'NotFoundError') {
      res.status(404).json({ error: 'Character not found' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}

export const spendGold = async (req, res) => {
  try {
    const { characterId, amount } = req.body;

    if (!amount || amount < 0) {
      return res.status(400).json({ error: 'Invalid Gold Amount' })
    }

    const character = await characterService.gainGold(characterId, amount);
    res.json(character)
  } catch (error) {
    if (error.name == 'ConcurrencyError') {
      res.status(409).json({ error: 'Concurrent5 modification detected' });
    } else if (error.name === 'NotFoundError') {
      res.status(404).json({ error: 'Character not found' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}

export const getLevelInfo = async (req, res) => {
  try {
    // why is it params and not body for this on? 
    const characterId = req.query.characterId;
    // why is it returning a levelInfo ojbect instead of a character? 
    const levelInfo = await characterService.getLevelInfo(characterId);
    res.json(levelInfo)
  }
  catch (error) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ error: 'Character not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

export const acquireLoot = async (req, res) => {
  try {
    const { characterId, loot } = req.body;
    if (!loot || !loot.type) {
      return res.status(400).json({ error: 'you must provide a loot item and it must have a type field' });
    }

    const character = await characterService.acquireLoot(characterId, loot);
    res.json(character);
  } catch (error) {
    if (error.name === 'ConcurrencyError') {
      res.status(409).json({ error: 'two threads stepping on each other trying to update character' });
    } else if (error.name === 'NotFoundError') {
      res.status(404).json({ error: 'we couldn\'t find your character' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}
