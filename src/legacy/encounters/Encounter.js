import mongoose from 'mongoose';

const LootSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['GOLD', 'ITEM'],
    required: true
  },
  item: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const EncounterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  experienceGained: { type: Number, default: 0 },
  goldGained: { type: Number, default: 0 },
  loot: { type: LootSchema, required: false },
  completed: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Encounter = mongoose.model('Encounter', EncounterSchema);