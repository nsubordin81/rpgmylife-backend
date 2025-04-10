import { StoreItem } from "../domain/StoreItem.js"

class StoreService {
  getStoreItems = async () => {
    const storeItem = await StoreItem.find()
    console.log("store items: ", storeItem)
    return storeItem
  }

  createStoreItem = async (data) => {
    const storeItem = new StoreItem(data)
    await storeItem.save()
    return storeItem
  }

  updateStoreItem = async (itemId) => {
    const resultItem = await StoreItem.find({ _id: itemId })
    if (resultItem === undefined) {
      throw new Error("the item to purchase was not found.")
    } else {
      resultItem.update({ _id: itemId }, { $set: { purchased: true } })
    }
  }
}

export const storeService = new StoreService()

export { StoreService }
