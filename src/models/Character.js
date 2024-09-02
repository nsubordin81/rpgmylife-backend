const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  race: { type: String, required: true },
  class: { type: String, required: true },
  level: { type: Number, default: 1 },
  totalExperience: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
  loot: { type: String, default: '' }
});

module.exports = mongoose.model('Character', CharacterSchema);