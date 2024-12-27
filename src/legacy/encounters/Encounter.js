import mongoose from 'mongoose';

const EncounterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  experienceGained: { type: Number, default: 0 },
  goldGained: { type: Number, default: 0 },
  loot: { 
    type: {
      type: String,
      enum: ['GOLD', 'ITEM'],
      required: false
    },
    item: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    }
  },
  completed: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Encounter = mongoose.model('Encounter', EncounterSchema);