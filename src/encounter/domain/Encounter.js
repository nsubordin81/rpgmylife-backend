export default class Encounter extends Aggregate {
    constructor(id = uuidv4()) {
        this.id = id;
        this.experience = 0;
        this.gold = 0;
        this.loot = [];
        this.completed = false;
    }

    static create(encounterData) {
        const id = uuidv4();
        const encounter = new Encounter(id);
        encounter.addEvent(ENCOUNTER_EVENTS.ENCOUNTER_CREATED, {
            id,
            experience: encounterData.experience,
            gold: encounterData.gold,
            loot: encounterData.loot
        });
        return encounter;
    }

    complete(characterId) {
        this.addEvent(ENCOUNTER_EVENTS.ENCOUNTER_COMPLETED, {
            id: this.id
        });
        
        // Emit existing character events for rewards
        this.addEvent(CHARACTER_EVENTS.GAINED_EXPERIENCE, {
            characterId,
            amount: this.experience
        });
        
        this.addEvent(CHARACTER_EVENTS.GAINED_GOLD, {
            characterId,
            amount: this.gold
        });
        
        if (this.loot.length > 0) {
            this.addEvent(CHARACTER_EVENTS.ACQUIRED_LOOT, {
                characterId,
                items: this.loot
            });
        }
    }

    applyEvent(event) {
        super.applyEvent(event);

        switch (event.type) {
            case ENCOUNTER_EVENTS.ENCOUNTER_CREATED:
                this.experience = event.payload.experience;
                this.gold = event.payload.gold;
                this.loot = event.payload.loot;
                break;
            case ENCOUNTER_EVENTS.ENCOUNTER_COMPLETED:
                this.completed = true;
                break;
        }
    }

    toDTO() {
        return {
            id: this.id,
            experience: this.experience,
            gold: this.gold,
            loot: this.loot,
            completed: this.completed
        };
    }

    get experienceGained() {
        return this.experience;
    }

    get goldGained() {
        return this.gold;
    }

    get lootGained() {
        return this.loot;
    }

    get isCompleted() {
        return this.completed;
    }

    get version() {
        return this.aggregateVersion;
    }

    static async load(id, eventStore) {
        const encounter = new Encounter(id);
        const events = await eventStore.getEventsForAggregate(id);
        encounter.applyEvents(events);
        return encounter;
    }


}