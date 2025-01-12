import mongoose from 'mongoose';

const QuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  expReward: { type: Number, required: true, min: 1 },
  goldReward: { type: Number, required: true, min: 1 },
  abilityReward: { 
    type: String,
    required: false
  },
  category: { type: String, required: true },
  deadline: { type: Date },
  completed: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Quest = mongoose.model('Quest', QuestSchema);