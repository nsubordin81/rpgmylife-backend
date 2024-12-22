const questService = require('./questService');

exports.getQuests = async (req, res) => {
  try {
    const quests = await questService.getQuests();
    res.json(quests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuest = async (req, res) => {
  try {
    console.log('Received quest data:', req.body); // Add this logging
    const quest = await questService.createQuest(req.body);
    res.status(201).json(quest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.completeQuest = async (req, res) => {
  try {
    const quest = await questService.completeQuest(req.params.id);
    res.json(quest);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getQuest = async (req, res) => {
  try {
    const quest = await questService.getQuest(req.params.id);
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    res.json(quest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
