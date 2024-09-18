const Encounter = require('../models/Encounter');

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
    const encounter = await Encounter.findByIdAndUpdate(
      encounterId,
      { completed: true },
      { new: true }
    );
    if (!encounter) {
      throw new Error('Encounter not found');
    }
    return encounter;
  } catch (error) {
    console.error('Error in completeEncounter service:', error);
    throw error;
  }
};