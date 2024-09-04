const Encounter = require('../models/Encounter');

exports.getEncounters = async (req, res) => {
  try {
    const encounters = await Encounter.find();
    if (!encounters || encounters.length === 0) {
      return res.status(204).send(); // No Content
    }
    res.json(encounters);
  } catch (error) {
    console.error('Error in getEncounters:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.createEncounter = async (req, res) => {
  try {
    const encounter = await encounterService.createEncounter(req.body);
    res.status(201).json(encounter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.completeEncounter = async (req, res) => {
  try {
    const encounter = await encounterService.completeEncounter(req.params.id);
    res.json(encounter);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};