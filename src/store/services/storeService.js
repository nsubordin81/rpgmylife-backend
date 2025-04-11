import { storeitems } from "../domain/StoreItem.js"
import Character from "../../character/domain/Character.js"

class StoreService {
  getStoreItems = async () => {
    const storeItem = await storeitems.find()
    console.log("store items: ", storeItem)
    return storeItem
  }

  createStoreItem = async (data) => {
    const storeItem = new storeitems(data)
    await storeItem.save()
    return storeItem
  }

  updateStoreItem = async (itemId, characterId) => {
    try {
      // Run both operations in parallel
      const [updateResult, character] = await Promise.all([
        storeitems.findOneAndUpdate(
          { _id: itemId },
          { $set: { purchased: true } },
          {
            new: true, // Return updated document
            lean: true, // Return plain JS object for better performance
          }
        ),
        Character.load(characterId),
      ])

      if (!updateResult) {
        throw new Error("The item to purchase was not found.")
      }

      character.gainGold(-updateResult.price)
      await character.save()

      // Return both updated entities to avoid additional queries
      return {
        item: updateResult,
        character: character,
      }
    } catch (error) {
      console.error("Error in updateStoreItem:", error)
      throw error
    }
  }
}

export const storeService = new StoreService()

export { StoreService }
