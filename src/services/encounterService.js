const Encounter = require('../models/Encounter');

exports.getEncounters = async (req, res) => {
  console.log('getEncounters called');
  console.log('req:', req);
  console.log('res:', res);
  try {
    console.log('GET request to /encounters');
    const encounters = await Encounter.find();
    
    if (!res || typeof res.status !== 'function') {
      console.error('Response object is invalid');
      throw new Error('Invalid response object');
    }

    if (!encounters || encounters.length === 0) {
      console.log('No encounters found, returning 204');
      return res.status(204).send(); // No Content
    }
    console.log(`Found ${encounters.length} encounters, returning JSON`);
    res.json(encounters);
  } catch (error) {
    console.error('Error in getEncounters:', error);
    if (res && typeof res.status === 'function') {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      console.error('Unable to send error response due to invalid response object');
    }
  }
};

exports.createEncounter = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is empty or undefined' });
    }

    const { name, description, type } = req.body;

    if (!name || !description || !type) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields: {
          name: !name,
          description: !description,
          type: !type
        }
      });
    }


exports.completeEncounter = async (req, res) => {
  try {
    const encounter = await encounterService.completeEncounter(req.params.id);
    res.json(encounter);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};