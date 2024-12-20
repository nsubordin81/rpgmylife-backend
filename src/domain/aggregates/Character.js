const Aggregate = require('../infrastructure/Aggregate');
const eventStore = require('../infrastructure/EventStore');
const levelSystem = require('../../utils/gameRules')

class Character extends Aggregate {
  constructor(id) {
    super(id);
    this.gold = 0;
    this.totalExperience = 0;
    this.level = 1;
    // TODO - add the other properties from the character domain object you have
    // ... other properties
  }

  gainExperience(amount) {
    this.addEvent('GAINED_EXPERIENCE', { amount });
  }

  // ok I feel like I'm grasping somethign here so let me write about it
  // the aggregate object has the behavior in it to process an event that is sent to it, 
  // but b3elow we see the gainGold event that it also kind of owns the definition of that event
  // that is an interesting observation. it makes everything easy to find to be sure
  applyEvent(event) {
    super.applyEvent(event);
    
    switch (event.type) {
      case 'CHARACTER_CREATED':
        this.name = event.payload.name;
        this.race = event.payload.race;
        this.class = event.payload.class;
        break;
      case 'GAINED_GOLD':
        this.gold += event.payload.amount;
        break;
      case 'GAINED_EXPERIENCE':
        this.totalExperience += event.payload.amount;
        this.level = levelSystem.calculateLevel(this.totalExperience);
        break;
      // ... other event handlers
    }
  }

  gainGold(amount) {
    this.addEvent('GAINED_GOLD', { amount });
  }

  // Static method to rebuild character from events
  static async load(characterId) {
    // we know from writing the event store class how this works, go get all of the events in chronological order for this character object
    const events = await eventStore.getEvents(characterId);
    const character = new Character(characterId);
    character.applyEvents(events);
    return character;
  }

  // Save any uncommitted changes
  async save() {
    for (const event of this.changes) {
        // so I get you can save the events that were sent to this aggregate and then clear them, but does it matter if you apply and then save or save and then eventually apply? 
        // I'm not sure there
      await eventStore.saveEvent(event);
    }
    this.clearChanges();
  }
}

module.exports = Character;