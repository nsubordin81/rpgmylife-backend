const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  expReward: { type: Number, required: true },
  goldReward: { type: Number, required: true },
  abilityReward: { type: String },
  category: { type: String, required: true },
  deadline: { type: Date },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Quest', QuestSchema);
