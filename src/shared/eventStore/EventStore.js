const CharacterEvent = require('../../models/CharacterEvent');

class EventStore {
  async saveEvent(event) {
    const latestVersion = await this.getLatestVersion(event.characterId);
    event.version = latestVersion + 1;
    
    const newEvent = new CharacterEvent(
    {
      characterId: event.characterId,
      type: event.type,
      payload: event.payload,
      version: event.version
    });

    try 
    {
      await newEvent.save();
    } catch (error)
    {
      if (error.code === 11000) 
      {
        // I guess we cknow this can happen we accidentally create a duplicate identifier
        throw new ConcurrencyError('Event version conflict')
      }
    }

  }

  async getEvents(characterId) {
    // get all events for character in ascending order
    return CharacterEvent.find({ characterId })
       // this is how we get ascending events
      .sort({ version: 1 })
      // this is something from mongo that says "don't hydrate the object" in other words, give back a plain javascript object
      .lean();
  }

  async getLatestVersion(characterId) {
    // getting the most recent event document by querying the events in descending order
    // I don't really understand this syntax
    const latestEvent = await CharacterEvent.findOne(
        // filter to only this character out of all character events
      { characterId },
      // projection just give me the version field back
      { version: 1 },
      // sort them in descending order
      { sort: { version: -1 } }
    );
    // null coalesce so if the latestEvent is not null you give its version property otherwise return 0
    return latestEvent?.version || 0;
  }
}

module.exports = new EventStore();