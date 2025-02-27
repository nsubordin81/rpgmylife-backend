// filepath: /Users/taylor.bird/code/myapps/rpgmylife-backend/src/shared/eventStore/HybridEventStore.js
import { FileSystemEventStore } from './FileSystemEventStore.js';
import { MongoEventStore } from './MongoEventStore.js';

export class HybridEventStore {
  constructor() {
    this.mongoStore = new MongoEventStore();
    this.fileStore = new FileSystemEventStore();
  }

  async saveEvent(event) {
    await Promise.all([
      this.mongoStore.saveEvent(event),
      this.fileStore.appendEvent(event)
    ]);
  }

  async getEvents(aggregateId, type) {
    // Primary read path still from MongoDB
    return this.mongoStore.getEvents(aggregateId, type);
  }
}