const Encounter = require('./Encounter');
const characterService = require('../../character/services/CharacterService');

exports.getEncounters = async () => {
  try {
    const encounters = await Encounter.find();
    return encounters;
  } catch (error) {
    console.error('Error in getEncounters service:', error);
    throw error;
  }
};

exports.createEncounter = async (encounterData) => {
  try {
    console.log("Encounter data received in service:", encounterData);
    const newEncounter = new Encounter(encounterData);
    const savedEncounter = await newEncounter.save();
    return savedEncounter;
  } catch (error) {
    console.error('Error in createEncounter service:', error);
    throw error;
  }
};


exports.completeEncounter = async (encounterId) => {
  try {
    // Find the encounter
    const encounter = await Encounter.findById(encounterId);
    if (!encounter) {
      throw new Error('Encounter not found');
    }

    // Calculate character updates
    const updateData = {
      $inc: {  // Using $inc for atomic updates
        totalExperience: encounter.experienceGained,
        gold: encounter.goldGained
      }
    };

    // Update character through characterService
    const character = await characterService.updateCharacter(null, updateData);

    // Mark encounter as completed
    encounter.completed = true;
    await encounter.save();

    return {
      encounter,
      character
    };
  } catch (error) {
    console.error('Error in completeEncounter service:', error);
    throw error;
  }
};