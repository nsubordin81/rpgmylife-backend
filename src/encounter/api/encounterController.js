import { encounterService } from "../../legacy/encounters/encounterService.js";

export const getEncounter = async (req, res) => 
{
    try {
        const encounter = await encounterService.getEncounter(req.params.id);
        if (!encounter) {
          return res.status(404).json({ message: 'Encounter not found' });
        }
        res.json(encounter);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

export const getEncounters = async (req, res) => 
{
    try {
        return await Encounter.find({});
      } catch (error) {
        console.error('Error fetching encounters:', error);
        throw error;
      }
}

export const createEncounter = async (req, res) =>
{
    try {
        const encounter = await encounterService.createEncounter(req.body);
        res.status(201).json(encounter);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const completeEncounter = async (req, res) =>
{
    try {
        const encounter = await encounterService.completeEncounter(req.params.id, req.body.characterId);
        res.json(encounter);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}