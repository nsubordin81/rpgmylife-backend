import Encounter from '../domain/Encounter.js';
import { eventStore } from '../../shared/eventStore/EventStore.js';
import { ENCOUNTER_EVENTS } from '../events/encounterEvents.js';

class EncounterService {
  async getEncounters() {
    try {
      // Get all encounter creation events
      const events = await eventStore.find({
        type: ENCOUNTER_EVENTS.ENCOUNTER_CREATED
      });
      
      // Load full encounter state for each
      const encounters = await Promise.all(
        events.map(event => Encounter.load(event.id))
      );
      
      return encounters.map(encounter => encounter.toDTO());
    } catch (error) {
      console.error('Error fetching encounters:', error);
      throw error;
    }
  }

  async getEncounter(encounterId) {
    try {
      const encounter = await Encounter.load(encounterId);
      return encounter.toDTO();
    } catch (error) {
      console.error('Error fetching encounter:', error);
      throw error;
    }
  }

  async createEncounter(encounterData) {
    try {
      const encounter = Encounter.create(encounterData);
      await encounter.save();
      return encounter.toDTO();
    } catch (error) {
      console.error('Error creating encounter:', error);
      throw error;
    }
  }

  async completeEncounter(encounterId, characterId) {
    try {
      const encounter = await this.getEncounter(encounterId);
      if (!encounter) {
        throw new Error('Encounter not found');
      }
      encounter.completed = true;
      encounter.completedBy = characterId;
      await encounter.save();
      return encounter;
    } catch (error) {
      console.error('Error completing encounter:', error);
      throw error;
    }
  }
}