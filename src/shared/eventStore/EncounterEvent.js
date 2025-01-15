import { mongoose } from 'mongoose'

const EncounterEventSchema = new mongoose.Schema({
    encounterId: {type: String, required: true},
    type: {type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true},
    timestamp: {type: Date, default: Date.now},
    version: { type: Number, required: true}
});

// add index for efficient event retrieval
EncounterEventSchema.index({ encounterId: 1, version: 1 });

// Optionally add a unique compound index to prevent duplicate versions
EncounterEventSchema.index({ encounterId: 1, version: 1 }, { unique: true});

export const EncounterEvent = mongoose.model('EncounterEvent', EncounterEventSchema);