// TODO - now that this has been altered, I'm guessing it brokes stuff, here his what I've gotta do now: 
/**
 *  You are correct about the following:

You need an encounter event type.
You need to update the switch statement to support that type.
You need to make updates elsewhere in the code that depends on this to call it with an event type.
Good luck with your implementation!
 */

import { CharacterEvent } from './CharacterEvent.js';
import { EncounterEvent } from './EncounterEvent.js';
import { ConcurrencyError } from '../../infrastructure/errors/ConcurrencyError.js';

class EventStore {
  async saveEvent(event) {
    const EventModel = this.getEventModel(event.type);

    const latestVersion = await this.getLatestVersion(event.aggregateId, EventModel);
    event.version = latestVersion + 1;

    const newEvent = new EventModel(event);

    try {
      await newEvent.save();
      return newEvent;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConcurrencyError('Event version conflict');
      }
    }
  }

  async find(criteria) {
    const EventModel = this.getEventModel(criteria.type);
    return EventModel.find(criteria)
      .sort({ version: 1 })
      .lean();
  }

  async getEvents(aggregateId, type) {
    const EventModel = this.getEventModel(type);
    return EventModel.find({ aggregateId })
      .sort({ version: 1 })
      .lean();
  }

  async getLatestVersion(aggregateId, EventModel) {
    const latestEvent = await EventModel.findOne(
      // this is fancy and mysterious syntax let me break it down. we are finding on the character id (-object projection going on here to define that)
      { aggregateId },
      // using object projection once again to specify that we want to return just the version field instead of the whole Event object
      { version: 1 },
      // and finally we are using object literal here to specify that we want to sort by version key in descending order
      { sort: { version: -1 } }
    );
    return latestEvent?.version || 0;
  }

  getEventModel(type) {
    switch (type) {
      case 'CHARACTER_EVENT':
        return CharacterEvent;
      case 'ENCOUNTER_EVENT':
        return EncounterEvent;
      // Add other event models here as needed
      default:
        throw new Error(`Unknown event type: ${type}`);
    }
  }
}

export const eventStore = new EventStore();
