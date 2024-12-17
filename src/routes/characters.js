// it is cool that express is a module, I think I need to learn moer about that
const express = require('express');
const router = express.Router();
const characterService = require('../services/CharacterService');

router.post('/characters', async (req, res) => {
  try {
    const character = await characterService.createCharacter(req.body);
    res.json(character);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/characters/:id/gain-gold', async (req, res) => {
  try {
    const character = await characterService.gainGold(
      req.params.id,
      req.body.amount
    );
    res.json(character);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/characters/:id', async (req, res) => {
  try {
    const character = await characterService.getCharacter(req.params.id);
    res.json(character);
  } catch (error) {
    res.status(404).json({ error: 'Character not found' });
  }
});

module.exports = router;

// examples for how to call these: 
/**
 * 
 * 
### Usage Example:

```javascript
// Creating a character
const response = await fetch('/characters', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Gandalf',
    race: 'Human',
    class: 'Wizard'
  })
});

// Gaining gold
await fetch('/characters/123/gain-gold', {
  method: 'POST',
  body: JSON.stringify({
    amount: 100
  })
});
```

 * 
 */