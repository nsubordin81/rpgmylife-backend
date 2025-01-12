import { encounterService } from "../../legacy/encounters/encounterService";

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