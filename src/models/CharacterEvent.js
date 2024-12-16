const mongoose = require('mongoose');

const CharactereventSchema = new mongoose.Schema({
    characterId: {type: mongoose.Schema.Types.ObjectId, required: true},
    type: {type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true},
    timestamp: {type: Date, default: Date.now},
    version: { type: Number, required: true}
})

module.exports = mongoose.model('CharacterEvent', CharacterEventSchema);
