const encounterService = require('../services/encounterService');

exports.getEncounters = async (req, res) => {
  try {
    const encounters = await encounterService.getEncounters();
    res.json(encounters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEncounter = async (req, res) => {
  try {
    const encounter = await encounterService.getEncounter(req.params.id);
    if (!encounter) {
      return res.status(404).json({ message: 'Encounter not found' });
    }
    res.json(encounter);
  } catch (error) {
    res.status(500).json({ message: error.message });
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