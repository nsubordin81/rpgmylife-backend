import { storeService } from "../services/storeService.js"

export const getStoreItems = async (req, res) => {
  try {
    console.log("getting store items")
    const items = await storeService.getStoreItems()
    console.log("store items: ", items)
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createStoreItem = async (req, res) => {
  //do a bit of input validation first
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({ message: "Name and price are required" })
  }
  try {
    console.log("Creating store item with data:", req.body) // Add this logging
    const item = await storeService.createStoreItem(req.body)
    res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const purchaseStoreItem = async (req, res) => {
  console.log("this is the body:", JSON.stringify(req.body, null, 2))
  if (!req.body.itemId) {
    return res.status(400).json({ message: "item id is required" })
  }
  try {
    console.log(`processing purchase of item ${itemId}`)
    const item = storeService.updateStoreItem(req.body.itemId)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
