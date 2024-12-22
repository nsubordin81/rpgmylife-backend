const mongoose = require('mongoose');

const CharacterEventSchema = new mongoose.Schema({
    characterId: {type: mongoose.Schema.Types.ObjectId, required: true},
    type: {type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true},
    timestamp: {type: Date, default: Date.now},
    version: { type: Number, required: true}
});

// add index for efficient event retrieval
CharacterEventSchema.index({ characterId: 1, version: 1 });

// Optionally add a unique compound index to prevent duplicate versions
CharacterEventSchema.index({ characterId: 1, version: 1 }, { unique: true});

module.exports = mongoose.model('CharacterEvent', CharacterEventSchema);
