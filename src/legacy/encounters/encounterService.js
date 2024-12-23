import api from './api.js';
import { LOOT_TYPES } from '../../character/events/characterEvents.js';
import { updateCharacterExperience, gainGold, acquireLoot} from './characterService.js';


export const ENCOUNTER_EVENTS = {
  ENCOUNTER_CREATED: 'ENCOUNTER_CREATED',
  ENCOUNTER_COMPLETED: 'ENCOUNTER_COMPLETED',
  ENCOUNTER_FAILED: 'ENCOUNTER_FAILED'
};

export const getEncounters = async () => {
  try {
    const response = await api.get('/encounters');
    return response.data;
  } catch (error) {
    console.error('Error fetching encounters:', error);
    throw error;
  }
};

export const createEncounter = async (encounterData) => {
  try {
    const response = await api.post('/encounters', {
      type: ENCOUNTER_EVENTS.ENCOUNTER_CREATED,
      payload: encounterData
    });
    return response.data;
  } catch (error) {
    console.error('Error creating encounter:', error);
    throw error;
  }
};

export const completeEncounter = async (encounterId) => {
  try {
    // First mark the encounter as completed
    const response = await api.post(`/encounters/${encounterId}/complete`, {
      type: ENCOUNTER_EVENTS.ENCOUNTER_COMPLETED
    });

    const encounter = response.data;

    // Process rewards
    await Promise.all([
      // Award experience
      updateCharacterExperience(encounter.experienceGained),
      
      // Award gold
      gainGold(encounter.goldGained),
      
      // Award any loot if present
      encounter.loot && acquireLoot({
        type: LOOT_TYPES.ITEM,
        item: encounter.loot
      })
    ]);

    return encounter;
  } catch (error) {
    console.error('Error completing encounter:', error);
    throw error;
  }
};
