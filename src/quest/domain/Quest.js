import Aggregate from '../../shared/eventStore/Aggregate.js';
import { QUEST_EVENTS } from '../events/questEvents.js';
import { eventStore } from '../../shared/eventStore/EventStore.js';
import { v4 as uuidv4 } from 'uuid';

export default class Quest extends Aggregate {
    constructor(id = uuidv4()) {
        super(id);
        this.name = '';
        this.description = '';
        this.deadline = null;
        this.experienceReward = 0;
        this.goldReward = 0;
        this.abilityReward = null;
        this.category = '';
        this.completed = false;
        this.completedAt = null;
    }

    static create(questData) {
        const id = uuidv4();
        const quest = new Quest(id);
        quest.addEvent(QUEST_EVENTS.QUEST_CREATED, {
            id,
            name: questData.name,
            description: questData.description,
            deadline: questData.deadline,
            experienceReward: questData.experienceReward,
            goldReward: questData.goldReward,
            abilityReward: questData.abilityReward,
            category: questData.category
        });
        return quest;
    }

    complete(characterId) {
        if (this.completed) {
            throw new Error('Quest is already completed');
        }
        if (this.deadline && new Date() > this.deadline) {
            throw new Error('Quest deadline has passed');
        }

        this.addEvent(QUEST_EVENTS.QUEST_COMPLETED, {
            characterId,
            completedAt: new Date()
        });
    }

    applyEvent(event) {
        supper.applyEvent(event);

        switch(event.type) {
            case QUEST_EVENTS.QUEST_CREATED:
                Object.assign(this, event.payload);
                break;

            case QUEST_EVENTS.QUEST_COMPLETED:
                this.completed = true;
                this.completedAt = event.payload.completedAt;
                break;
        }
    }

    toDTO() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            deadline: this.deadline,
            experienceReward: this.experienceReward,
            goldReward: this.goldReward,
            abilityReward: this.abilityReward,
            category: this.category,
            completed: this.completed,
            completedAt: this.completedAt
        };
    }

    static async load(id) {
        const events = await eventStore.getEvents(questId, EVENT_TYPES.QUEST);
        if (events.length === 0) {
            throw new Error('Quest not found');
        }
        const quest = new Quest(questId);
        quest.applyEvents(events);
        return quest;
    }

    async save() {
        for(const event of this.changes) {
            await eventStore.saveEvent(event);
        }
        this.clearChanges();
    }
}