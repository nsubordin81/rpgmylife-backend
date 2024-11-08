const Quest = require('../models/Quest');

exports.getQuests = async () => {
  try {
    const quests = await Quest.find();
    return quests;  // Simply return the quests array (might be empty)
  } catch (error) {
    console.error('Error in getQuests service:', error);
    throw error;
  }
};

exports.createQuest = async (questData) => {
  try {
    const newQuest = new Quest(questData);
    const savedQuest = await newQuest.save();
    return savedQuest;
  } catch (error) {
    console.error('Error in createQuest service:', error);
    throw error;
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
