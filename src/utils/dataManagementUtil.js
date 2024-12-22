const Character = require('../character/domain/Character');
const Quest = require('../legacy/quests/Quest');
const Encounter = require('../legacy/encounters/Encounter');

exports.clearAllData = async () => {
  try {
    const results = await Promise.all([
      Character.deleteMany({}),
      Quest.deleteMany({}),
      Encounter.deleteMany({})
    ]);

    return {
      deletedCounts: {
        characters: results[0].deletedCount,
        quests: results[1].deletedCount,
        encounters: results[2].deletedCount
      }
    };
  } catch (error) {
    console.error('Clear all data failed:', error);
    throw error;
  }
};

exports.clearModelData = async (modelName) => {
  try {
    let result;
    switch (modelName.toLowerCase()) {
      case 'character':
        result = await Character.deleteMany({});
        break;
      case 'quest':
        result = await Quest.deleteMany({});
        break;
      case 'encounter':
        result = await Encounter.deleteMany({});
        break;
      default:
        throw new Error(`Unknown model: ${modelName}`);
    }

    return {
      model: modelName,
      deletedCount: result.deletedCount
    };
  } catch (error) {
    console.error(`Clear ${modelName} data failed:`, error);
    throw error;
  }
};