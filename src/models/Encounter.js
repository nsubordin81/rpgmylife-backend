const mongoose = require('mongoose');

const EncounterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  experienceGained: { type: Number, default: 0 },
  goldGained: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Encounter', EncounterSchema);
