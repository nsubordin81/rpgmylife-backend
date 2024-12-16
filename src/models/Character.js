const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  race: { type: String, required: true },
  class: { type: String, required: true },
  level: { type: Number, default: 1 },
  totalExperience: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
  loot: { type: String, default: '' },
  version: {type: Number, default: 0}
});

// starting to try out some event store stuff, lets see where it goes
// how come we can just do this? interested
CharacterSchema.methods.applyEvent = function(event) {
  switch (event.type) {
    case 'GAINED_EXPERIENCE':
      this.totalExperience += event.payload.amount;
      this.level = calculateLevel(this.totalExperience);
      break;
    case 'GAINED_GOLD':
      this.gold += event.payload.amount
      break;
    case 'ACQUIRED_LOOT':
      this.loot += `${this.loot ? ', ' : ''}${event.payload.item}`;
      break;
  }
  this.version++;
}

module.exports = mongoose.model('Character', CharacterSchema);