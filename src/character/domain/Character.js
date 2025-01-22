import Aggregate from '../../shared/eventStore/Aggregate.js';
import { CHARACTER_EVENTS, LOOT_TYPES } from '../events/characterEvents.js';
import { levelSystem } from '../../utils/gameRules.js'
import { eventStore } from '../../shared/eventStore/EventStore.js';
import { v4 as uuidv4 } from 'uuid';


export default class Character extends Aggregate {
  constructor(id= uuidv4()) {
    super(id);
    this.name = '';
    this.race = '';
    this.class = '';
    this.level = 1;
    this.totalExperience = 0;
    this.gold = 0;
    this.loot = []
  }

  static create(characterData)
  {
    const id = uuidv4();
    const character = new Character(id);
    character.addEvent(CHARACTER_EVENTS.CHARACTER_CREATED, {
      id,
      name: characterData.name,
      race: characterData.race,
      class: characterData.class
    });
    return character
  }

  toDTO()
  {
    return {
      id: this.id,
      name: this.name,
      race: this.race,
      class: this.class,
      level: this.level,
      totalExperience: this.totalExperience,
      gold: this.gold,
      loot: this.loot
    };
  }
 
  // ok I feel like I'm grasping somethign here so let me write about it
  // the aggregate object has the behavior in it to process an event that is sent to it, 
  // but b3elow we see the gainGold event that it also kind of owns the definition of that event
  // that is an interesting observation. it makes everything easy to find to be sure
  applyEvent(event) {
    super.applyEvent(event);
    
    switch (event.type) {
      case CHARACTER_EVENTS.CHARACTER_CREATED:
        this.name = event.payload.name;
        this.race = event.payload.race;
        this.class = event.payload.class;
        break;

      case CHARACTER_EVENTS.GAINED_GOLD:
        this.gold += event.payload.amount;
        break;


      case CHARACTER_EVENTS.GAINED_EXPERIENCE:
        this.totalExperience += event.payload.amount;
        const newLevel = levelSystem.calculateLevel(this.totalExperience);
        if (newLevel !== this.level) {
          this.addEvent(CHARACTER_EVENTS.LEVEL_CHANGED, {
            oldLevel: this.level,
            newLevel: newLevel
          });
          this.level = newLevel;
        }
        break;

        case CHARACTER_EVENTS.SPENT_GOLD:
          this.gold -= event.payload.amount;
          break;
        
        case CHARACTER_EVENTS.ACQUIRED_LOOT:
          if(event.payload.type == LOOT_TYPES.GOLD)
          {
            this.gold += event.payload.amount;
          } else
          {
            this.loot.push(event.payload.item)
          }
          break;
        
        case CHARACTER_EVENTS.LEVEL_CHANGED:
          this.level = event.payload.newLevel
          break;
    }
  }

  // Events that Character can process

  gainExperience(amount) {
    this.addEvent(CHARACTER_EVENTS.GAINED_EXPERIENCE, { amount });
  }

  gainGold(amount) {
    this.addEvent(CHARACTER_EVENTS.GAINED_GOLD, { amount });
  }

  spendGold(amount) {
    this.addEvent(CHARACTER_EVENTS.SPENT_GOLD, { amount });
  }

  acquireLoot(loot) {
    if (!loot.type)
    {
      throw new Error('Loot type must be provided');
    }
    if (loot.type === LOOT_TYPES.GOLD)
    {
      if( !loot.amount || loot.amount < 0 ) {
        throw new Error('Gold amount must exist and be positive');
      } 
    } else if (loot.type === LOOT_TYPES.ITEM ) {
      if (!loot.item) {
        throw new Error('Item details required');
      }
    }
    this.addEvent(CHARACTER_EVENTS.ACQUIRED_LOOT, { loot });
  }

  // Static method to rebuild character from events
  static async load(characterId) {
    const events = await eventStore.getEvents(characterId, EVENT_TYPES.CHARACTER);
    console.log(`attempting to load character with id ${characterId}`);
    if (events.length === 0) {
        throw new Error('NotFoundError: Character not found');
    }
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
