import { mongoose } from 'mongoose';

const QuestEventSchema = new mongoose.Schema({
    aggregateId: {type: String, required: true},
    type: {type: String, required: true },
    payload: {type: mongoose.Schema.Types.Mixed, required: true},
    timestamp: {type: Date, default: Date.now},
    version: {type: Number, required: true}
});

QuestEventSchema.index({ aggregateId: 1, version: 1 });
QuestEventSchema.index({ aggregateId: 1, version: 1 }, { unique: true });

export const QuestEvent = mongoose.model('QuestEvent', QuestEventSchema);