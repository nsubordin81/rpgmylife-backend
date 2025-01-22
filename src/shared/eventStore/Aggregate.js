// ok so I guess this is just a model that will support the notion fo aggregates in my app
export default class Aggregate {
    constructor(id) {
      // being a base classs, things we know we will need are a unique identifier, probably a root entity then
      this.id = id;
      // versioning this aggregate, hopefully the replay of events can keep this updated
      this.version = 0;
      // interesting, there is an array of events that haven't processed all the way yet.
      this.changes = []; // Uncommitted events
    }
  
    // Apply an event to the aggregate
    applyEvent(event) {
      this.version = event.version;
      // Actual event handling will be implemented by child classes
    }
  
    // Apply multiple events
    applyEvents(events) {
      events.forEach(event => this.applyEvent(event));
    }
  
    // Add a new event to uncommitted changes
    // I guess you can have a backlog of events to save
    addEvent(type, payload) {
      const baseType = type.split('.')[0];
      const event = {
        aggregateId: this.id,
        type,
        baseType,
        payload,
        timestamp: new Date(),
        version: this.version + 1
      };
      this.changes.push(event);
      this.applyEvent(event);
    }
  
    // Clear uncommitted changes after they're saved
    clearChanges() {
        // I find it interesting that the base class here never calls this, it is delegating the responsibility of this to the apply ffunction if its kids? 
      this.changes = [];
    }
  }