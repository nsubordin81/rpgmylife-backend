const Quest = require('../models/Quest');

exports.getQuests = async (req, res) => {
  try {
    const quests = await Quest.find();
    if (!quests || quests.length === 0) {
      return res.status(204).send();
    }
    res.json(quests);
  } catch (error) {
    console.error('Error in getQuests:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.createQuest = async (req, res) => {
  try {
    const newQuest = new Quest(req.body);
    const savedQuest = await newQuest.save();
    res.status(201).json(savedQuest);
  } catch (error) {
    console.error('Error in createQuest:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.completeQuest = async (questId) => {
  const quest = await Quest.findByIdAndUpdate(
    questId,
    { completed: true },
    { new: true }
  );
  if (!quest) {
    throw new Error('Quest not found');
  }
  return quest;
};