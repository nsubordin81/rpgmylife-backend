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

const characterService = require('./characterService');

exports.completeQuest = async (questId) => {
  try {
    // Find the quest
    const quest = await Quest.findById(questId);
    if (!quest) {
      throw new Error('Quest not found');
    }

    // Update character stats using $inc
    const updateData = {
      $inc: {
        totalExperience: quest.expReward,
        gold: quest.goldReward
      }
    };

    // Update character through characterService
    const character = await characterService.updateCharacter(null, updateData);

    // Mark quest as completed
    quest.completed = true;
    await quest.save();

    return {
      quest,
      character
    };
  } catch (error) {
    console.error('Error in completeQuest service:', error);
    throw error;
  }
};

exports.getQuest = async (questId) => {
  try {
    const quest = await Quest.findById(questId);
    return quest;
  } catch (error) {
    console.error('Error in getQuest service:', error);
    throw error;
  }
};
