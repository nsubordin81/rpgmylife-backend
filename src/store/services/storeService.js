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
    const updateResult = await storeitems.findOneAndUpdate(
      { _id: itemId },
      { $set: { purchased: true } }
    )

    console.log(`here is the result for ya: ${updateResult}`)

    if (!updateResult) {
      throw new Error("the item to purchase was not found.")
    }

    console.log(`the character to load has id: ${characterId}`)
    const character = Character.load(characterId)
    console.log(
      `deducting ${updateResult.price} gold from ${character.name}'s purse`
    )
    character.gainGold(-updateResult.price)
  }
}

export const storeService = new StoreService()

export { StoreService }
