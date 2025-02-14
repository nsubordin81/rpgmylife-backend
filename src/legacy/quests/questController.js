import { questService } from './questService.js';

export const questController = {
  getQuests: async (req, res) => {
    try {
      const quests = await questService.getQuests();
      res.json(quests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createQuest: async (req, res) => {
    try {
      console.log('Received quest data:', req.body); // Add this logging
      const quest = await questService.createQuest(req.body);
      res.status(201).json(quest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  completeQuest: async (req, res) => {
    try {
      const { characterId } = req.body; // Get characterId from request body
      if (!characterId) {
        return res.status(400).json({ message: 'Character ID is required' });
      }
      const quest = await questService.completeQuest(req.params.id, characterId);
      res.json(quest);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getQuest: async (req, res) => {
    try {
      const quest = await questService.getQuest(req.params.id);
      if (!quest) {
        return res.status(404).json({ message: 'Quest not found' });
      }
      res.json(quest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
